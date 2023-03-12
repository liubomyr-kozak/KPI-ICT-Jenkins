FROM jenkins/jenkins:lts-jdk11

USER root

RUN apt-get update && apt-get install -y git curl

RUN jenkins-plugin-cli --plugins "greenballs:latest"

USER jenkins
