pipeline {
   agent {
      docker {
         image 'hello-world'
         args '-p 9191:80'
      }
   }
   stages {
      stage('Build') {
         steps {
            sh 'echo "Hello World!"'
         }
      }
   }
   post {
      always {
         sh 'docker stop $(docker ps -q -f "ancestor=hello-world")'
      }
   }
}