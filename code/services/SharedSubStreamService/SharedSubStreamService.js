/**
 * This is the transformed Shared Subscription Stream Service version of the Trigger Invoked Code Service.
 */

function SharedSubStreamService(req, resp) {
  ClearBlade.init({ request: req });
  const messaging = ClearBlade.Messaging();

  // ### The trigger Message topic comes here ###
  const SHARED_MSG_TOPIC = "$share/StreamServiceGroup/device/+";
  const COLLECTION_NAME = "example_connection";
  const collection = ClearBlade.Collection({
    collectionName: COLLECTION_NAME
  });
  var counter = 0;
    
  messaging.subscribe(SHARED_MSG_TOPIC, function(err, errMsg) {
    if (err) {
      messaging.publish("error", "sub failed: " + errMsg);
      resp.error(errMsg);
    }
    messaging.publish("success", "Subscribed to SHARED_MSG_TOPIC");
    WaitLoop();
  });


  function WaitLoop(){
    while(true) {
      try{
        messaging.waitForMessage([SHARED_MSG_TOPIC], HandleMessage);
      } catch(e){
        messaging.publish("exception","WaitforMessage Exception:" +e);
      }
    }
  }

  function HandleMessage(err, msg, topic) {
    if (err) {
      messaging.publish("error", "failed to wait for message: " + err + " " + msg + "  " + topic);
    } else {
      // ### Invoke ProcessMessage Function Here!! ###
      ProcessMessage(msg);   
    }
  }

  function ProcessMessage(msg){
    try{
      const msgBody = JSON.parse(msg);
      // Perform any additonal processing here.
      PerformAction(msgBody);
    
    } catch(e){
      messaging.publish("error", "Error Parsing Message: " + errMsg);
      resp.error(e);
    }
  }

  function PerformAction(msg){
    // Can be any action, like insert/update into collection or publishing on a topic
    var opts = {};
    opts.collectionName="example_collection";
    opts.item = msg;
    
    cbCreatePromise(opts)
    .catch(function(err){
      resp.error(err);
    });
    // ### We get rid of the resp.success, since it exits the code. ###
    // .then(function(data){
    //   resp.success(data);
    // });
  }

}