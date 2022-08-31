import * as cdk from "@aws-cdk/core";
import { Stack, Construct, StackProps, SecretValue } from "@aws-cdk/core";
import { Artifact } from "@aws-cdk/aws-codepipeline";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { GitHubSourceAction } from "@aws-cdk/aws-codepipeline-actions";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const sourceAction = new GitHubSourceAction({
      actionName: "GitHubSource",
      output: sourceArtifact,
      oauthToken: SecretValue.secretsManager("github-token"),
      owner: "mikemcd3912",
      repo: "UnicornTraderAPI",
      branch: "main",
    });
  }
}