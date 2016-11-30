$(document).ready(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB5RU6blh4shjCL5qiKbCmQv-7U-FQRr1I",
    authDomain: "superrrrrrrrrrrrr-e754b.firebaseapp.com",
    databaseURL: "https://superrrrrrrrrrrrr-e754b.firebaseio.com",
    storageBucket: "superrrrrrrrrrrrr-e754b.appspot.com",
    messagingSenderId: "620439889484"
  };
  firebase.initializeApp(config);

  var photoURL;
  // Firebase database reference
  var dbChatRoom = firebase.database().ref().child('chatroom');
  var dbUser = firebase.database().ref().child('user');
  var storageRef=firebase.storage().ref();
  // REGISTER DOM ELEMENTS
  const $messageField = $('#messageInput');
  const $nameField = $('#nameInput');
  const $messageList = $('#example-messages');
  const $email = $('#email');
  const $password = $('#password');
  const $btnSignIn = $('#btnSignIn');
  const $btnSignUp = $('#btnSignUp');
  const $btnSignOut = $('#btnSignOut');
  const $message = $('#example-messages');
  const $hovershadow = $('.hover-shadow');
  const $signInfo = $('#sign-info');
  const $editName = $('#editName');
  const $editSubmit = $('#editSubmit');
  const $editAge= $('#editAge');
  const $editJob= $('#editJob');
  const $editPic= $('#editPic');
  const $editDescrip= $('#editDescrip');
  const $Photo = $('#Photo');
  const $photo = $('#photo');
  const $PName = $('#PName');
  const $PAge = $('#PAge');
  const $PJob = $('#PJob');
  const $PDescrip = $('#PDescrip');

  // Hovershadow
  $hovershadow.hover(
    function(){
      $(this).addClass("mdl-shadow--4dp");
    },
    function(){
      $(this).removeClass("mdl-shadow--4dp");
    }
  );

  function handleFileSelect(evt){
    evt.stopPropagation();
    evt.preventDefault();
    var file=evt.target.files[0];

    var metadata={
      'contentType':file.type
    };
    // Push to child path.
  // [START oncomplete]
  storageRef.child('images/' + file.name).put(file, metadata).then(function(snapshot) {
    console.log('Uploaded', snapshot.totalBytes, 'bytes.');
    console.log(snapshot.metadata);
    photoURL = snapshot.metadata.downloadURLs[0];
    console.log('File available at', photoURL);
    $photo.attr("src",photoURL);
  }).catch(function(error) {
    // [START onfailure]
    console.error('Upload failed:', error);
    // [END onfailure]
  });
  // [END oncomplete]

  }
  window.onload =function(){
    $editPic.change(handleFileSelect);
    console.log('triggered!!');
  }
  // SignIn/SignUp/SignOut Button status
  var user = firebase.auth().currentUser;
  if (user) {
    $btnSignIn.attr('disabled', 'disabled');
    $btnSignUp.attr('disabled', 'disabled');
    $btnSignOut.removeAttr('disabled')
  } else {
    $btnSignOut.attr('disabled', 'disabled');
    $btnSignIn.removeAttr('disabled')
    $btnSignUp.removeAttr('disabled')
  }

  // Sign In
  $btnSignIn.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    // signIn
    const promise = auth.signInWithEmailAndPassword(email, pass);
    promise.catch(function(e){
      console.log(e.message);
      $signInfo.html(e.message);
    });
    promise.then(function(){
      console.log('SignIn User');
    });
  });

  // SignUp
  $btnSignUp.click(function(e){
    const email = $email.val();
    const pass = $password.val();
    const auth = firebase.auth();
    // signUp
    const promise = auth.createUserWithEmailAndPassword(email, pass);
    promise.catch(function(e){
      console.log(e.message);
      $signInfo.html(e.message);
    });
    promise.then(function(user){
      console.log("SignUp user is "+user.email);
      const dbUserid = dbUser.child(user.uid);
      dbUserid.push({email:user.email});
    });
  });
 //SignOut
 $btnSignOut.click(function(){
   const promise = firebase.auth().signOut();
   promise.catch(function(e){
     console.log('signOut error',e.message);
   });
   promise.then(function(){
     window.location = './index.html';
   });
 });
  // Listening Login User
  firebase.auth().onAuthStateChanged(function(user){
    if(user) {
      console.log(user);
      $PName.html(user.displayName);
      $Photo.attr("src",user.photoURL);
      $photo.attr("src",user.photoURL);
      $signInfo.html(user.email+" is login...");
      $btnSignIn.attr('disabled', 'disabled');
      $btnSignUp.attr('disabled', 'disabled');
      $btnSignOut.removeAttr('disabled')
      // Add a callback that is triggered for each chat message.
      dbChatRoom.limitToLast(10).on('child_added', function (snapshot) {
        //GET DATA
        var data = snapshot.val();
        var username = data.name || "anonymous";
        var message = data.text;
        var image = data.photoURL;

        console.log(data.photoURL);
        //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
        var $messageElement = $("<li>");
        var $avatar = $("<img>");
        $avatar.attr("src",image);
        $avatar.attr("height",50);
        $avatar.attr("width",50);
        var $nameElement = $("<strong class='example-chat-username'></strong>");
        $nameElement.text(username);
        $messageElement.text(message).prepend($nameElement).prepend($avatar);

        //ADD MESSAGE
        $messageList.append($messageElement)

        //SCROLL TO BOTTOM OF MESSAGE LIST
        $messageList[0].scrollTop = $messageList[0].scrollHeight;
      });//child_added callback

    } else {
      console.log("not logged in");
    }

    //User profile
    const dbUid = dbUser.child(user.uid);
    dbUid.on('child_added',function(snapshot){
      var data=snapshot.val();
      console.log(data);
      var age=data.age;
      var job=data.job;
      var description=data.description;

      $PAge.html(age);
      $PJob.html(job);
      $PDescrip.html(description);
    });

    console.log(data.photoURL);
  });

  // SignOut
  $btnSignOut.click(function(){
    firebase.auth().signOut();
    console.log('LogOut');
    $signInfo.html('No one login...');
    $btnSignOut.attr('disabled', 'disabled');
    $btnSignIn.removeAttr('disabled')
    $btnSignUp.removeAttr('disabled')
    $message.html('');
  });

  // LISTEN FOR KEYPRESS EVENT
  $messageField.keypress(function (e) {
    var user = firebase.auth().currentUser;
    if (e.keyCode == 13) {
      //FIELD VALUES
      var username = $nameField.val();
      var message = $messageField.val();
      console.log(username);
      console.log(message);

      //SAVE DATA TO FIREBASE AND EMPTY FIELD
      dbChatRoom.push({name:username, text:message,photoURL:user.photoURL});
      $messageField.val('');
    }
  });

  $editSubmit.click(function(){
      var user = firebase.auth().currentUser;

      var name = $editName.val();
      var age = $editAge.val();
      var job = $editJob.val();
      var description = $editDescrip.val();

      const promise=user.updateProfile({
        displayName: name,
        photoURL: photoURL
      }).then(
        function(){
          console.log(user.displayName);
          $PName.html(user.displayName);
          $Photo.attr("src",user.photoURL);
        }


      );
      const dbUid = dbUser.child(user.uid).child('info');
      dbUid.update({
          age:age,
          job:job,
          description:description
        })
      console.log(user);



          dbUser.child(user.uid).on('child_added',function(snapshot){
            var data=snapshot.val();
            var age=data.age;
            var job=data.job;
            var description=data.description;

            $PAge.html(age);
            $PJob.html(job);
            $PDescrip.html(description);
          });
  });

});
