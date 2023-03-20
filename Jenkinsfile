pipeline {
    agent any

    stages {
        stage('Stop old containers') {
            steps {
                script {
                    try {
                        sh 'docker-compose down || true'
                    } catch (Exception e) {
                        echo "Failed to stop old containers, but continuing anyway."
                    }
                }
            }
        }

        stage('NPM Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'docker build -t student-bot -f DockerfileStudent .'
                sh 'docker build -t teacher-bot -f DockerfileTeacher .'
            }
        }

        stage('Run with Docker Compose') {
            steps {
                sh 'docker-compose up -d'
            }
        }
    }
}