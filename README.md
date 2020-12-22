# POC: Deploy a React App on AWS S3

![s3-depl](https://github.com/AntonioDiaz/deploy_s3/workflows/s3-depl/badge.svg?branch=master)

![diagram](https://user-images.githubusercontent.com/725743/102906372-d24ba500-4474-11eb-81d5-aa650c3a91a1.png)

<!-- TOC depthfrom:2 orderedlist:false -->

- [Links](#links)
- [Playing with React](#playing-with-react)
- [AWS S3](#aws-s3)
- [AWS API Gateway](#aws-api-gateway)
- [AWS Lambdas](#aws-lambdas)
  - [InitMusLambdaProxy](#initmuslambdaproxy)
  - [ScoreMusLambdaProxy](#scoremuslambdaproxy)

<!-- /TOC -->


## Links
* Deploy a React app from Github repository to S3: 
  * https://dev.to/nobleobioma/deploy-a-react-app-to-amazon-s3-using-github-actions-51e
  * https://medium.com/@wolovim/deploying-create-react-app-to-s3-or-cloudfront-48dae4ce0af
* Create REST API with Lamda and API Gateway:
  * https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-create-api-as-simple-proxy-for-lambda.html

## Playing with React

* There will be 2 screens
  * __Init__ to create the championship where the number of teams are chosen.
![init](https://user-images.githubusercontent.com/725743/102904411-fb1e6b00-4471-11eb-9fe3-26a151ebf0db.png)
  * __Score and classfication__
  ![dasboard](https://user-images.githubusercontent.com/725743/102904404-f8bc1100-4471-11eb-8624-20ae81fa98c6.png)
 

## AWS S3
There are two publc S3 bucket: one for React app and other for the json to store matches and classfication.


* Bucket policy
```json
{
    "Version": "2012-10-17",
    "Id": "Policy1607413118034",
    "Statement": [
        {
            "Sid": "Stmt1607413115884",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::campeonato-mus-json/*"
        }
    ]
}
```

* Enable CORS
```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "GET"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": []
    }
]
```

## AWS API Gateway
![api_gateway](https://user-images.githubusercontent.com/725743/102907076-cdd3bc00-4475-11eb-93f0-aa182ebd549a.png)


## AWS Lambdas

### InitMusLambdaProxy
```js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

function initArray (myLength) {
  let myArray = []
  for (let i = 0; i < myLength; i++) {
    let subArray = []
    for (let j = 0; j < myLength; j++) {
      let value = "*"
      if (i<j)
        value = "-"
      subArray.push(value)
    }
    myArray.push(subArray)
  }
  return myArray
}

function initClassification (matchesArray) {
  let classification = []
  //init teams
  matchesArray.forEach ((e, index) => {
    let team = {id: index, played:0, wins: 0, lost:0, points_favor: 0, points_again: 0 }
    classification.push(team)    
  });
  return classification
}

exports.handler = async (event) => {
    console.log("request: " + JSON.stringify(event));
    let body = JSON.parse(event.body)
    console.log("parejas count: " + body.num_parejas)
    let numParejas = body.num_parejas
    let parejas = body.parejas
    let matchesArray = initArray(numParejas)
    let classificationArray = initClassification(matchesArray)
    let myJson = {
        teamsCount: numParejas,
        teams: parejas,
        matches: matchesArray,
        classification: classificationArray
    }
    let currentJson
    try {
        const destparams = {
            Bucket: "campeonato-mus-json",
            Key: "mus.json",
            Body: JSON.stringify(myJson),
            ContentType: "json"
        };
        await s3.putObject(destparams).promise()
        const params = {
            Bucket: "campeonato-mus-json",
            Key: "mus.json"
        }
        currentJson = await s3.getObject(params).promise();
        console.log("currentJson " + currentJson.Body)
    } catch (error) {
        console.log(error);
        return;
    }   
    
    let responseBody = {
        num_parejas: currentJson.Body
    };    
    let response = {
        statusCode: 204,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        }        
    };
    return response;
};
```

### ScoreMusLambdaProxy
```js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    let team01 = event.queryStringParameters.team01
    let team02 = event.queryStringParameters.team02

    let score01 = event.queryStringParameters.score01
    let score02 = event.queryStringParameters.score02

    console.log("team01 " + team01)
    console.log("team02 " + team02)
    
    const params = {
        Bucket: "campeonato-mus-json",
        Key: "mus.json"
    }    
    
    let currentJson = await s3.getObject(params).promise();
    console.log("currentJson " + currentJson.Body)
    
    let competition = JSON.parse(currentJson.Body)
    let newMatchesArray = updateScore(competition.matches, team01, team02, score01, score02)
    let newClassification = createClasification(newMatchesArray)    
    console.log(newMatchesArray)    
    competition.matches = newMatchesArray
    competition.classification = newClassification

    const destparams = {
        Bucket: "campeonato-mus-json",
        Key: "mus.json",
        Body: JSON.stringify(competition),
        ContentType: "json"
    };
    await s3.putObject(destparams).promise()
    
    let responseBody = {
        message: "ok"    
    };
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody),
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        }
    };
    return response;
};


function updateScore(matchesArray, team01, team02, score01, score02) {
  if (typeof score01 === 'undefined')
    score01 = ""
  if (typeof score02 === 'undefined')
    score02 = ""
  
  let newMatchesArray = [].concat(matchesArray)
  if (team01<team02) {
    newMatchesArray[team01][team02] = score01 + "-" + score02
  } else {
    newMatchesArray[team02][team01] = score02 + "-" + score01
  }
  return newMatchesArray
}

function getScore (matchesArray, team01, team02) {
  if (team01<team02) {
    let scoreStr = matchesArray[team01][team02]
    if (scoreStr==="-") {
      return null
    }
    return scoreStr.split("-")
  } else {
    let scoreStr = matchesArray[team02][team01]
    if (scoreStr==="-") {
      return null
    }
    return scoreStr.split("-").reverse()
  }
}

function didBeat (matchesArray, team01, team02) {
  let scoreArray = getScore(matchesArray, team01, team02)
  if (scoreArray==null)
    return false;
  return scoreArray[0]>scoreArray[1]
}

function initClassification (matchesArray) {
  let classification = []
  //init teams
  matchesArray.forEach ((e, index) => {
    let team = {id: index, played:0, wins: 0, lost:0, points_favor: 0, points_again: 0 }
    classification.push(team)    
  });
  return classification
}

function createClasification(matchesArray) {
  let classification = initClassification(matchesArray)
  matchesArray.forEach((subArray, teamId01) => {
    subArray.forEach((score, teamId02) => {
      if (teamId01<teamId02 && score!=="-") {
        let score01 = parseInt(score.split("-")[0])
        let score02 = parseInt(score.split("-")[1])
        classification[teamId01].played++
        classification[teamId02].played++

        classification[teamId01].points_favor += score01
        classification[teamId02].points_favor += score02

        classification[teamId01].points_again += score02
        classification[teamId02].points_again += score01

        classification[teamId01].wins += (score01>score02)?1:0
        classification[teamId02].wins += (score02>score01)?1:0

        classification[teamId01].lost += (score02>score01)?1:0
        classification[teamId02].lost += (score01>score02)?1:0
      }
    })
  })
  classification.sort((a, b) => {
    return a.wins===b.wins? didBeat(matchesArray, b.id, a.id) : (b.wins - a.wins)
  })
  return classification
}
```
