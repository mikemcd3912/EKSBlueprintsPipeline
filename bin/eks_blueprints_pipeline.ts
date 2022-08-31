// bin/my-eks-blueprints.ts
import * as cdk from 'aws-cdk-lib';
import ClusterConstruct from '../lib/eks_blueprints_pipeline-stack';
import PipelineConstruct from '../lib/pipeline';
import ServiceInfraStack from '../lib/service_infra_stack';


const app = new cdk.App();
const account = process.env.CDK_DEFAULT_ACCOUNT!;
const region = process.env.CDK_DEFAULT_REGION;
const env = { account, region }

new ClusterConstruct(app, 'cluster', { env });
new PipelineConstruct(app, 'pipeline', {env });
new ServiceInfraStack(app, 'serviceInfra', { env });