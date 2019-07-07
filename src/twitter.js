// OAuth1認証用インスタンス
var twitter = TwitterWebService.getInstance(
  PropertiesService.getScriptProperties().getProperty("TWITTER_API_KEY"),
  PropertiesService.getScriptProperties().getProperty("TWITTER_API_SECRET")
);

// 他のプロジェクトでTwitterWebServiceを使用していると
// そちらと認証が同じになってしまうのでそれの回避目的。
twitter.getService = function() {
  return OAuth1.createService('Twitter2')
    .setAccessTokenUrl('https://api.twitter.com/oauth/access_token')
    .setRequestTokenUrl('https://api.twitter.com/oauth/request_token')
    .setAuthorizationUrl('https://api.twitter.com/oauth/authorize')
    .setConsumerKey(twitter.consumer_key)
    .setConsumerSecret(twitter.consumer_secret)
    .setCallbackFunction('authCallback')
    .setPropertyStore(PropertiesService.getUserProperties())
}

// 認証を行う（必須）
function authorize() {
  twitter.authorize();
}

// 認証をリセット
function reset() {
  twitter.reset();
}

// 認証後のコールバック（必須）
function authCallback(request) {
  return twitter.authCallback(request);
}

// メンション一覧の取得
function getMentions() {
  var service  = twitter.getService();
  var response = service.fetch('https://api.twitter.com/1.1/statuses/mentions_timeline.json');
  var data = JSON.parse(response)
  //Logger.log(data);
  return data;
}

// ツイートを投稿
function postTweet(msg) {
  var service  = twitter.getService();
  var response = service.fetch('https://api.twitter.com/1.1/statuses/update.json', {
    method: 'post',
    payload: { status: msg }
  });
  Logger.log(JSON.parse(response));
}
