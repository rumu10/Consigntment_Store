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

