var jackalApp = angular.module('jackalApp', ['firebase']);

var url = window.location.href;
var trancatedURL = url.split('?')[0].split('/');
var section = trancatedURL[trancatedURL.length-1];
var sessionId = url.split('?')[1];
var userId = url.split('?')[2];
var sessionCode;

jackalApp.controller(
	'DatabaseCtrl',
	function DatabaseCtrl($scope, angularFire, angularFireCollection, angularFireAuth){
		var ref = new Firebase('https://mxu.firebaseio.com/');
		var userRef = null;
		var userSessionsRef = null;
                var userPrivateSessionsRef = null;
                var userPublicSessionsRef = null;
		angularFireAuth.initialize(ref, {scope: $scope, name: "user"});
                
		$scope.myPrivateSessions = [];
		$scope.myPublicSessions = [];
                $scope.allPublicSessions = [];
		$scope.active = {title: '', code: '', public: false}
                
                var session = {title: '', code: '', public: false, created: undefined, lastChanged: undefined}
                
                if( section == "console.html" && sessionId != undefined){
                    if(userId != undefined){
                        userPublicSessionsRef = ref.child('sessions').child(userId).child('public').child(sessionId);
                        userPublicSessionsRef.child('code').once('value', function(snapshot){
                            if (snapshot.val() != null){
                                session.code = snapshot.val();
                                    codeMirrorText = snapshot.val();
                                    session.public = true;
                                    userPublicSessionsRef.child('title').once('value', function(snapshot) {
                                        session.title = snapshot.val();
                                        //$scope.setActive(sessionId, session, true);
                                    });
                                    userPublicSessionsRef.child('created').once('value', function(snapshot) {
                                        session.created = snapshot.val();
                                        //$scope.setActive(sessionId, session, true);
                                    });
                                    userPublicSessionsRef.child('forkedFrom').once('value', function(snapshot) {
                                        if (snapshot.val() != null){
                                            $scope.setActive(sessionId, session, true, snapshot.val().split('|')[0]);
                                        } else {
                                            $scope.setActive(sessionId, session, true, userId);
                                        }
                                    });
                            } else {
                                userPrivateSessionsRef = ref.child('sessions').child(userId).child('private').child(sessionId);
                                userPrivateSessionsRef.child('code').once('value', function(snapshot) {
                                     if (snapshot.val() != null){
                                        session.code = snapshot.val();
                                        codeMirrorText = snapshot.val();
                                        session.public = false;
                                        userPrivateSessionsRef.child('title').once('value', function(snapshot) {
                                            session.title = snapshot.val(); 
                                            $scope.setActive(sessionId, session, false, undefined);
                                        });
                                        userPrivateSessionsRef.child('created').once('value', function(snapshot) {
                                            session.created = snapshot.val();
                                            $scope.setActive(sessionId, session, false, undefined);
                                        });
                                     }
                                });
                            }
                        });
                    }
                }
                
                $scope.logActive = function(){
                    console.log($scope.active);
                }

		$scope.login = function() {
			angularFireAuth.login('github');
		}

		$scope.logout = function() {
			console.log('logging out user ' + $scope.user.uid);
			userRef.child('online').set(false);
			angularFireAuth.logout();
			userRef = null;
			userSessionsRef = null;
                        $scope.myPrivateSessions = [];
			$scope.myPublicSessions = [];
			$scope.allPublicSessions = [];
                        window.location.href = url.split('/')[0].concat('index.html');
		}

		$scope.$on('angularFireAuth:login', function(evt, user) {
			var usersRef = ref.child('users');
                        
                        $scope.allPublicSessions = [];
			if(user != undefined){
			usersRef.once('value', function(snapshot) {
				if(snapshot.val()[user.uid] == null) {
					console.log('creating user ' + user.uid);
					usersRef.child(user.uid).set({
						username: user.username
					});
				} else {
					console.log('logging in as ' + user.uid);
					usersRef.child(user.uid).child('online').set(true);
				}
                                
                                // iterate over the uids in the user table
				for(uid in snapshot.val()) {
					// find the public sessions for every user except the currently logged in one
					//if(uid != $scope.user.uid) {
						// add an angularFireCollection for that user's public sessions
						$scope.allPublicSessions.push({
							'name': snapshot.val()[uid].name,
                                                        'uid': uid,
							'sessions': angularFireCollection(ref.child('sessions').child(uid).child('public'))
						});
					//}
				}
			});
                            
                                if( section == "console.html" && sessionId != undefined){
                                    if(userId != user.uid){
                                        $('#save-button').attr("disabled", true);
                                        $('#share-button').attr("disabled", true);
                                        $('#fork-button').attr("disabled", false);
                                    } else{
                                        $('#fork-button').attr("disabled", true);
                                    }
                                }
                                
                                if(user.uid == undefined){
                                    if(section == "profile.html"){
                                        window.history.back();
                                    }else if(section == "console.html"){
                                        $('#save-button').attr("disabled", true);
                                        $('#share-button').attr("disabled", true);
                                        $('#fork-button').attr("disabled", true);
                                        $('#print-button').attr("disabled", true);
                                    }
                                }
                        
			userRef = usersRef.child(user.uid);
			userSessionsRef = ref.child('sessions').child(user.uid);
                        
			$scope.myPrivateSessions = angularFireCollection(userSessionsRef.child('private'));
			$scope.myPublicSessions = angularFireCollection(userSessionsRef.child('public'));
                        }
		});

		$scope.addSession = function() {
			var sessionRef = ref.child('sessions').child($scope.user.uid).child($scope.active.public ? 'public' : 'private').push();
			
			sessionRef.set({
				title: $scope.active.title,
				code: $scope.active.code,
				created: Firebase.ServerValue.TIMESTAMP,
				lastChanged: Firebase.ServerValue.TIMESTAMP
			});
		}

		$scope.setActive = function(id, session, public, owner) {
			$scope.activeID = id;
			$scope.active = session;
			$scope.active.public = public;
                        $scope.active.owner = owner;
		}
                
                $scope.saveOrAddSession = function() {
                    if($scope.active.title == ''){
                        alert("Please enter title.");
                    } else {
                        $scope.active.code = document.getElementById('saveText').innerHTML;
                        if (document.getElementById('sessionFlag').innerHTML == 'New') {
                            $scope.active.public = false;
                            $scope.addSession();
                            window.location.href = url.split('?')[0].split('console.html')[0].concat('profile.html');
                            console.log('New');
                        } else {
                            $scope.saveSession();
                            console.log("saved");
                        }
                        $('#saveModal').modal('hide');
                    }
                }
                
                $scope.forkSession = function() {
			var sessionRef = ref.child('sessions/' + $scope.user.uid + '/' + ($scope.active.public ? 'public' : 'private')).push();

			sessionRef.set({
				title: $scope.active.title,
				code: $scope.active.code,
				created: Firebase.ServerValue.TIMESTAMP,
				lastChanged: Firebase.ServerValue.TIMESTAMP,
				forkedFrom: $scope.active.owner + '|' + $scope.activeID
			});
                        alert("Fork successfully!");
		}
              
                $scope.shareSession = function(){
                    $scope.active.public = true;
                    $scope.saveSession();
                    $('#shareModal').modal('hide');
                }

		$scope.saveSession = function() {
			var sessionRef = ref.child('sessions').child($scope.user.uid).child($scope.active.public ? 'public' : 'private').child($scope.activeID);
			var oppositeRef = userSessionsRef.child($scope.active.public ? 'private' : 'public');
			
			oppositeRef.once('value', function(snapshot) {
				if(snapshot.val()[$scope.activeID] != null) {
					oppositeRef.child($scope.activeID).remove();
				}
			});

			sessionRef.set({
				title: $scope.active.title,
				code: $scope.active.code,
				created: $scope.active.created,
				lastChanged: Firebase.ServerValue.TIMESTAMP
			});

			sessionRef.child('lastChanged').once('value', function(snapshot) {
				$scope.active.lastChanged = snapshot.val();
			});
		}

		$scope.removeSession = function() {
			var sessionRef = ref.child('sessions').child($scope.user.uid).child($scope.active.public ? 'public' : 'private').child($scope.activeID);
			sessionRef.remove();
			$scope.closeSession();
		}

		$scope.closeSession = function() {
			$scope.activeID = undefined;
			$scope.active = {title: '', code: '', public: false, created: undefined, lastChanged: undefined};
		}                
                
	}
);