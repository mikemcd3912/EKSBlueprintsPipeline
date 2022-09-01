import * as cdk from 'aws-cdk-lib';
import {Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export default class ServiceInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id)

    const account = props?.env?.account!;
    const region = props?.env?.region!;

    const table = new dynamodb.Table(this, 'Posts', {
        partitionKey: {
            name: 'postid',
            type: dynamodb.AttributeType.STRING
        },
    })
    
    const repository = new ecr.Repository(this, 'Repo', {
      repositoryName: "capstone",
      imageScanOnPush: true,
    });
  }
}