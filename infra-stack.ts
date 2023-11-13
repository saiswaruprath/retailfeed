import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';




export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
     
    const retailfeediamrole =  new iam.Role(this, 'retailiamlogicalid',{
      roleName:'inventoryfeedlambdarole',
      description:'role for lambda service',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com')
    
    })
    retailfeediamrole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'))
    retailfeediamrole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'))
    retailfeediamrole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchFullAccess'))


    // lambda function
    const retaillambda = new lambda.Function(this, 'retaillambdalogicalid', {
      runtime: lambda.Runtime.PYTHON_3_10,
      handler: 'lambda_function.lambda_handler',
      code: lambda.Code.fromAsset('../services/'),
      role: retailfeediamrole,
    
  })

   retaillambda.node.addDependency(retailfeediamrole)

   // create an S3 bucket
   const retails3bucket = new s3.Bucket(this, 'retailbucketlogicalid',{
      bucketName:'retailfeeds3bucket456'
   })

   //s3 event notification
   retails3bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(retaillambda))
   

   // dynamodb
   const retaildynamodb = new dynamodb.Table(this, 'retaildynamodblogicalid',{
     tableName:'bankingtable',
     partitionKey:{ name:'customername', type: dynamodb.AttributeType.STRING }
   })

}
}
