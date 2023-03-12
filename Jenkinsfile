pipeline {
    agent {
      docker {
         image 'hello-world'
         args '-p 80:80'
      }
   }
   stages {
      stage('Build') {
         steps {
            sh 'echo "Hello World!"'
         }
      }
   }
}