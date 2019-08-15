function TriggerBasedService(req, resp) {
  if(!req.params || !req.params.body){
    resp.error("No body passed, probably not invoked by a trigger");
  }
  ClearBlade.init({request:req});
  ProcessMessage(req.params.body);

  function ProcessMessage(msg){
    try{
      const msgBody = JSON.parse(msg);
      // Perform any additonal processing here.
      PerformAction(msgBody);
    
    } catch(e){
      resp.error(e);
    }
  }

  function PerformAction(msg){
    // Can be any action, like insert/update into collection or publishing on a topic
    var opts = {};
    opts.collectionName="example_collection";
    opts.item = msg;
    cbCreatePromise(opts)
    .then(function(data){
      resp.success(data);
    })
    .catch(function(err){
      resp.error(err);
    });
  }
}