import com.github.gradle.node.npm.task.NpmTask

plugins {
  id("com.github.node-gradle.node") version "7.0.2"
}

repositories {
  mavenCentral()
}

node {
  version = "20.17.0"
  npmVersion = "10.8.3"
  download = true
}

tasks.register("reactStart", NpmTask::class) {
  dependsOn(tasks.npmInstall)
  args.addAll("run", "start")
}

val reactLint = tasks.register("reactLint", NpmTask::class) {
  dependsOn(tasks.npmInstall)
  args.addAll("run", "lint")
}

tasks.register("reactBuild", NpmTask::class) {
  dependsOn(tasks.npmInstall)
  dependsOn(reactLint)
  args.addAll("run", "build")
}
