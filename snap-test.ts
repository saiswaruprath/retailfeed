import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sqs from 'aws-cdk-lib/aws-sqs';

export class DeadLetterQueue extends sqs.Queue {
    public readonly messagesInQueueAlarm: cloudwatch.IAlarm;

    constructor(scope: Construct, id: string){
        super(scope, id);


        const alarm =  new cloudwatch.Alarm(this, 'Alarm', { 
            alarmDescription: 'There are messages in the Dead Letter Queue',
            evaluationPeriods: 1,
            threshold: 2,
            metric: this.metricApproximateNumberOfMessagesVisible(),
            alarmName: 'test'
        })
    }
}
