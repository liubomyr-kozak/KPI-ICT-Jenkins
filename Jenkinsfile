pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Run Teacher Telegram Bot') {
            steps {
                sh 'npm run start:teacher &'
            }
        }

        stage('Run Student Telegram Bot') {
            steps {
                sh 'npm run start:student &'
            }
        }
    }
}