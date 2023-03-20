pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'docker build -t student-bot -f DockerfileStudent .'
                sh 'docker build -t teacher-bot -f DockerfileTeacher .'
            }
        }

        stage('Run Rabbitmq') {
            steps {
                sh 'docker-compose up -d &'
            }
        }

        stage('Run Teacher Telegram Bot') {
            steps {
                sh 'docker run teacher-bot &'
            }
        }

        stage('Run Student Telegram Bot') {
            steps {
                sh 'docker run student-bot &'
            }
        }
    }
}