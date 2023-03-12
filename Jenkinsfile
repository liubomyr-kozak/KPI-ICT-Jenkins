pipeline {
    agent any

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    docker.build("my-node-app:latest")
                }
            }
        }

        stage('Docker Run') {
            steps {
                script {
                    docker.image("my-node-app:latest").run("-p 9191:3000")
                }
            }
        }
    }

    post {
        always {
            script {
                docker.image("my-node-app:latest").stop()
                docker.image("my-node-app:latest").remove()
            }
        }
    }
}