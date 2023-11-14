import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DeadLetterQueue } from "../lib/snap-test";

describe("DeadLetterQueue", () => {
    test("matches the snapshot", () => {
        const stack = new cdk.Stack();
        new DeadLetterQueue(stack, "DeadLetterQueue");

        const template = Template.fromStack(stack);
        expect(template.toJSON()).toMatchSnapshot();
    });
});