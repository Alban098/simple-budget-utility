plugins {
  java
  id("org.springframework.boot") version "3.3.3"
  id("io.spring.dependency-management") version "1.1.6"
  id("com.diffplug.spotless") version "7.0.0.BETA2"
}

java {
  toolchain {
    languageVersion = JavaLanguageVersion.of(21)
  }
}

repositories {
  mavenCentral()
}

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-batch")
  implementation("org.springframework.boot:spring-boot-starter-data-jpa")
  implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
  implementation("org.springframework.boot:spring-boot-starter-oauth2-resource-server")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.session:spring-session-core")
  implementation("org.thymeleaf.extras:thymeleaf-extras-springsecurity6")
  implementation("org.projectlombok:lombok")
  implementation("com.google.code.gson:gson:2.11.0")
  annotationProcessor("org.projectlombok:lombok")
  developmentOnly("org.springframework.boot:spring-boot-devtools")
  runtimeOnly("org.postgresql:postgresql")
//  providedRuntime("org.springframework.boot:spring-boot-starter-tomcat")
  testImplementation("org.springframework.boot:spring-boot-starter-test")
  testImplementation("org.springframework.batch:spring-batch-test")
  testImplementation("org.springframework.security:spring-security-test")
  testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.processResources.configure {
  dependsOn(":bundleReact")
}

spotless {
  java {
    googleJavaFormat("1.17.0").reflowLongStrings()
    formatAnnotations()
    licenseHeaderFile("./license-header")
  }
}
