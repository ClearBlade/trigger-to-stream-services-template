function Publisher(req, resp) {
  ClearBlade.init({request:req});
  const messaging = ClearBlade.Messaging();
  const msg = {
      data:"I am Active"
  }
  for(var i=0 ;i<1000;i++){
    messaging.publish("device/device"+ i, JSON.stringify(msg));
  }
  resp.success('Success');
}
