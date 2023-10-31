#Backend AWS Lamdba
## How to 
This backend works with the serverless framework and express.js .
To install/run, you need to install serverless globally:
```bash
npm install -g serverless

```
Then, you need to configure your AWS credentials:
```bash
serverless config credentials --provider aws --key YOUR_AWS_ACCESS_KEY --secret YOUR_AWS_SECRET_KEY
```
Now, install all the node dependencies:
```bash
npm install 
```
The project should be working :).

Once you have added a new method/whaterver. To deploy it, run :
```bash
serverless deploy

```

## Testing the endpoints
To test the endpoint you need to have curl installe in your system and run:
```bash
curl -X GET https://7pvpeztz21.execute-api.us-east-1.amazonaws.com/dev/ENDPOINT
```
### Example: Testing the connection to the db
```bash
curl -X GET https://7pvpeztz21.execute-api.us-east-1.amazonaws.com/dev/test_db
```
