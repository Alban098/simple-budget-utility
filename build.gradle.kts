group = "org.alban098"
version = "0.0.1-SNAPSHOT"

tasks.register("bundleReact", Copy::class) {
    dependsOn(project(":frontend").tasks.named("reactBuild"))
    from("./frontend/dist")
    into("./api/src/main/resources/static")
}

tasks.register("bundleApp", Copy::class) {
    dependsOn(tasks.named("bundleReact"))
}.configure {
    finalizedBy(project(":api").tasks.named("build"))
}