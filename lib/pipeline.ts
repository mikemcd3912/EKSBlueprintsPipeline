// lib/pipeline.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import { PlatformTeam } from '@aws-quickstart/eks-blueprints';

export default class PipelineConstruct extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps){
    super(scope, id)

    const account = props?.env?.account!;
    const region = props?.env?.region!;
    
    const adminTeam = new PlatformTeam( {
        name: "adminteam", // make sure this is unique within organization
        userRoleArn: 'arn:aws:iam::'+account+':role/Admin'
    })

    const cloud9 = new PlatformTeam( {
        name: "cloud9", // make sure this is unique within organization
        userRoleArn: 'arn:aws:iam::'+account+':role/dev-dev-blueprint-devblueprintMastersRole2DDF8CFC-VFC9LIYTLHPV'
    })
    
    const blueprint = blueprints.EksBlueprint.builder()
    .account(account)
    .region(region)
    .addOns()
    .teams(adminTeam, cloud9);
  
      // HERE WE ADD THE ARGOCD APP OF APPS REPO INFORMATION
    const repoUrl = 'https://github.com/mikemcd3912/EKSBlueprintsPipeline.git';

    const bootstrapRepo : blueprints.ApplicationRepository = {
        repoUrl,
        targetRevision: 'main',
    }

    // HERE WE GENERATE THE ADDON CONFIGURATIONS
    const devBootstrapArgo = new blueprints.ArgoCDAddOn({
        bootstrapRepo: {
            ...bootstrapRepo,
            path: 'envs/dev'
        },
    });
    const testBootstrapArgo = new blueprints.ArgoCDAddOn({
        bootstrapRepo: {
            ...bootstrapRepo,
            path: 'envs/test'
        },
    });
    const prodBootstrapArgo = new blueprints.ArgoCDAddOn({
        bootstrapRepo: {
            ...bootstrapRepo,
            path: 'envs/prod'
        },
    });
  
  
    blueprints.CodePipelineStack.builder()
      .name("containers-capstone-pipeline")
      .owner("mikemcd3912")
      .repository({
          repoUrl: 'EKSBlueprintsPipeline',
          credentialsSecretName: 'github-token',
          targetRevision: 'main'
      })
      .wave({
          id: "envs",
          stages: [
              { id: "dev", stackBuilder: blueprint.clone('us-west-2').addOns(devBootstrapArgo)},
              { id: "test", stackBuilder: blueprint.clone('us-east-2').addOns(testBootstrapArgo)},
              { id: "prod", stackBuilder: blueprint.clone('us-east-1').addOns(prodBootstrapArgo)}]
      })
      .build(scope, id+'-stack', props);
  }
}
