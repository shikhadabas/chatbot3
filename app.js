/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

// Create your bot with a function to receive messages from the user
// This default message handler is invoked if the user's utterance doesn't
// match any intents handled by other dialogs.
//var bot = new builder.UniversalBot(connector, function (session, args) {
    //session.send('You reached the default message handler. You said \'%s\'.', session.message.text);
//});
bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);

// Add the recognizer to the bot
//bot.recognizer(recognizer); 

var intents = new builder.IntentDialog({ recognizers: [recognizer] })
.matches('Greeting', (session) => {
    session.send('You reached Greeting intent, you said \'%s\'.', session.message.text);
})
.matches('Help', (session) => {
    session.send('You reached Help intent, you said \'%s\'.', session.message.text);
})
.matches('Cancel', (session) => {
    session.send('You reached Cancel intent, you said \'%s\'.', session.message.text);
})
.matches('firstIntent',(session)=> {
    var MongoClient = require('mongodb').MongoClient;
            var url = "mongodb://shikhadabas:shikha123@ds121665.mlab.com:21665/expense";
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
               

                var myquery = {
                    client: "abcd",
                    account: "A0001",
                    asset: "IBM",
                    shares: "3",
                    price: "$157",
                    decision: "",
                    buy_sell: "buy",
                    asset_description: "International Business Machines Corp.",
                    remarks: ""
                };
/*
                var newvalues = {
                    client: "Alicia Davis",
                    account: "A0001",
                    asset: "IBM",
                    shares: "3oo",
                    price: "$157",
                    decision: decisionsName,
                    buy_sell: "buy",
                    asset_description: "International Business Machines Corp.",
                    remarks: ""
                };
                db.collection("tradeapprovals").updateOne(myquery, newvalues, function(err, res) {  */
                    db.collection("tradeapprovals").insertOne(myquery, function(err, res) { 
                    if (err) throw err;
                    console.log("1 document updated");
                


                });
            })

    session.send("Got it! Here are the top 2 prospects I found in Saint Louis County Area. One:James David at 1 Orchard Lane,Two: Paul Smith at 1004 Couch Avenue. I can get you more details about them if you like. Give me a name for whom you need the details. ");
})

.matches('secondIntent',(session)=> {
    var clientName;
  
    if(session.message.text=='james david'|| session.message.text=="james")
    {
        console.log("inside first if block")
        clientName="Sure.As per my sources James David is married,aged 42 having 1 kid with an estimated income of $380k, net worth $200k and home value of $380k. You can also ask me for events or connections or investments associated with James David. What would you want to know next?"
    }
    if(session.message.text=="paul smith" || session.message.text=='paul')
    {
        console.log("inside second if block")
        clientName="Sure. As per my sources Paul Smith is married, aged 38, with an estimated income of $160K, net worth $280K and home value of $450K. You can also ask me for events or connections or investments associated with for Paul Smith. Which one would you like?"
    }  
    console.log("before session.send statement")             
    session.send(clientName)
}) 
.matches('thirdIntent',(session)=> {
    var eventName;
    if(session.message.text=="connections")
    {
        console.log("third intent... first if statement..")
        eventName="sure. I found one connection.Robert Clark is connected to James David through United Church of Christ,Kiekwood membership. Robert Clark is an existing member.Would you like me to send all these details to your email id? "
    }
    if(session.message.text=="events")
    {
        console.log("third intent... second if statement ..")
        eventName="Sure. I found one one event for James Smith. His family size changed with a new born in the family. Would you like me to send the details to your email?"
    }
    session.send(eventName)
})
.matches('forthIntent',(session)=> {
    var mailResponse
    if(session.message.text=="yes")
    {
        console.log("if statement...yes")
        mailResponse="I have emailed the prospect detals on your email id and same has been updated in your CRM system also. What else you want me to do? You can ask for news, alerts or trade notifications"
    }
    if(session.message.text=="no")
    {
        console.log("forth Intent..if statement .. no")
        mailResponse="What else you want me to do? You can ask for news, alerts, or trade notifications"
    }
    session.send(mailResponse)
})
.matches('Select_alert_Intent',(session)=>{
    var Select_options
    if(session.message.text=='alerts')
    {
       console.log('select alert intent..if statement..alerts')   
       Select_options='What Category of alerts would you like? Scheduled or Automated?'
    }
    if(session.message.text=='trades')
    {
        console.log('select alert intent..if statement...trades')
        Select_options='What Category within Trade notifications would you like to know about? Approval Blotter or Trade Initiation?'
    }
    session.send(Select_options)
})

.matches('Category_of_alerts',(session)=>{
    var  Select_Category
    
       Select_Category='Got it! There is one automated reminder as per the system today. Would you like to hear about it?'
   
    session.send( Select_Category)
})

.matches('Automated_Reminder_Answer ',(session)=>{
    var  Automated_Reminder_Answer
    
       Automated_Reminder_Answer='Sure. As per my records the Account Review for Richard Smith is scheduled to be completed by next week. Would you like to act on this or skip?'
   
    session.send( Automated_Reminder_Answer)
})
.matches('Account_Review ',(session)=>{
    var  Account_Review
    
       Account_Review='Okay. I have generated the latest Client Suitability Questionnaire as well as IPS forms for Richard Smith. Would you like me to send the details to his email id?'
   
    session.send( Account_Review)
})
.matches('Send_For_Review  ',(session)=>{
    var  Send_For_Review 
    
       Send_For_Review ='Okay. I have emailed the forms to view for review. Please verify.'
   
    session.send( Send_For_Review )
})
.matches('Verification_Done',(session)=>{
    var  Verification_Done  
 Verification_Done ='Okay. I have emailed them to Richard Smith. How else can I help you? '
   
    session.send( Verification_Done )
})
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
});

bot.dialog('/', intents);    

