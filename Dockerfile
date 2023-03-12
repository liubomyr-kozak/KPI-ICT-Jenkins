FROM jenkins/jenkins:lts-jdk11

USER root

RUN apt-get update && apt-get install -y git curl

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    ln -s /usr/bin/nodejs /usr/bin/node

RUN jenkins-plugin-cli --plugins "greenballs:latest"

USER jenkins
