/**
 * Created by Chandan on 7/22/2017.
 */

var scotchTodo = angular.module('appFilereader',['ngCookies']);
scotchTodo.directive('appFilereader', function($q) {
    var slice = Array.prototype.slice;

    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, element, attrs, ngModel) {
            if (!ngModel) return;

            ngModel.$render = function() {};

            element.bind('change', function(e) {
                var element = e.target;

                $q.all(slice.call(element.files, 0).map(readFile))
                    .then(function(values) {
                        if (element.multiple) ngModel.$setViewValue(values);
                        else ngModel.$setViewValue(values.length ? values[0] : null);
                    });

                function readFile(file) {
                    var deferred = $q.defer();

                    var reader = new FileReader();
                    reader.onload = function(e) {
                        deferred.resolve(e.target.result);
                    };
                    reader.onerror = function(e) {
                        deferred.reject(e);
                    };
                    reader.readAsDataURL(file);

                    return deferred.promise;
                }

            }); //change

        } //link
    }; //return
});
//var app = angular.module('myApp', ['file-model']);
function mainController($scope,$http,$window,$cookieStore) {
    $scope.formData = {};
    $scope.user={};
    $scope.admin={};
    $scope.abc={};
    $scope.todo;
    // when landing on the page, get all todos and show them
    $http.get('/api/todos')
        .success(function(data) {
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.store=function () {
        $cookieStore.put("se", $scope.formData.search2);
       $window.location.href='../index3.html';
 //       $scope.refresh();
    }
    $scope.signout=function () {
        $cookieStore.remove("userid");
        $cookieStore.remove("username");
        $cookieStore.remove("details");
        $window.location.href='../index2.html';
    }
$scope.checkadmin=function () {
    if($scope.admin.password=="chandangoyal111"){
        $http.get('/api/findalladmin')
            .success(function(data) {
                $scope.admin.books=data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    else if($scope.admin.password=="chandangoyal11"){
        $http.get('/api/getallusers')
            .success(function(data) {
                $scope.admin.users=data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
}

    $scope.cart=function () {
        $scope.formData.user=$cookieStore.get("userid")
        $http.post('/api/findcart',$scope.formData)
            .success(function(data) {
                $scope.todo = data;
                $scope.formData.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }

$scope.refresh=function () {
    $scope.formData.search=$cookieStore.get("se");
$scope.formData.user=$cookieStore.get("userid");
    $scope.find();
    if($cookieStore.get("se")==null){
        $scope.findlatest();
    }
    if($cookieStore.get("se")=="engineering"){
        $scope.engineering();
    }
    if($cookieStore.get("se")=="management"){
        $scope.management();
    }
    if($cookieStore.get("se")=="novels"){
        $scope.novels();
    }
    if($cookieStore.get("se")=="general"){
        $scope.general();
    }
    if($cookieStore.get("se")=="competitive"){
        $scope.competitive();
    }
    if($cookieStore.get("se")=="others"){
        $scope.others();
    }
    $cookieStore.remove("se");

}
$scope.savecategory1=function () {
    $cookieStore.put("se","engineering");

}
    $scope.savecategory2=function () {
        $cookieStore.put("se","management");
    }
    $scope.savecategory3=function () {
        $cookieStore.put("se","novels");
    }
    $scope.savecategory4=function () {
        $cookieStore.put("se","general");
    }
    $scope.savecategory5=function () {
        $cookieStore.put("se","competitive");
    }
    $scope.savecategory6=function () {
        $cookieStore.put("se","others");
    }
    $scope.details=function (deta) {
        $cookieStore.put("details",deta);
    }
    $scope.getdetails=function () {
        $scope.detail=$cookieStore.get("details");
        //
    }
    // when submitting the add form, send the text to the node API
    $scope.createTodo = function() {
      //  $scope.formData.user=$scope.user.emailid;
        //console.log($scope.file)
       /* if($scope.file==null){
            $scope.formData.bool=false;
        }
        else
            $scope.formData.bool=true;*/
	$scope.formData.path=document.getElementById('store').value
        $scope.formData.user=$cookieStore.get("userid");
        $http.post('/api/todos', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
$scope.find=function() {
    $http.post('/api/find',$scope.formData)
        .success(function(data) {
            $scope.todo = data;
             $scope.formData.todos = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}
    $scope.engineering=function() {
        $scope.formData.search="engineering";
        if(screen.width<=1100)
        document.getElementById("t1").style.display="none";
        $http.post('/api/find',$scope.formData)
            .success(function(data) {
                $scope.todo = data;
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    $scope.management=function() {
        $scope.formData.search="management";
        if(screen.width<=1100)
        document.getElementById("t1").style.display="none";
        $http.post('/api/find',$scope.formData)
            .success(function(data) {
                $scope.todo = data;
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    $scope.competitive=function() {
        $scope.formData.search="competitive";
        if(screen.width<=1100)
        document.getElementById("t1").style.display="none";
        $http.post('/api/find',$scope.formData)
            .success(function(data) {
                $scope.todo = data;
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    $scope.general=function() {
        $scope.formData.search="general knowledge";
        if(screen.width<=1100)
        document.getElementById("t1").style.display="none";
        $http.post('/api/find',$scope.formData)
            .success(function(data) {
                $scope.todo = data;
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    $scope.novels=function() {
        $scope.formData.search="novel";
        if(screen.width<=1100)
        document.getElementById("t1").style.display="none";
        $http.post('/api/find',$scope.formData)
            .success(function(data) {
                $scope.todo = data;
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    $scope.others=function() {
        $scope.formData.search="other";
        if(screen.width<=1100)
        document.getElementById("t1").style.display="none";
        $http.post('/api/findall',$scope.formData)
            .success(function(data) {
                $scope.todo = data;
                $scope.todos = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
$scope.join=function () {

    $http.post('/api/join',$scope.user)
        .success(function(data) {
            $scope.user.info = data;
            if($scope.user.info=="You are Registered"){
                $cookieStore.put("username",$scope.user.uname);
            $cookieStore.put("userid",$scope.user.emailid);
                $window.location.href='../index3.html';
            }
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}
$scope.checkcredentials=function () {
    if($cookieStore.get("userid")!=null){
        $window.location.href='../index3.html';
    }

}
$scope.profile1=function (dat) {
    $scope.user.uname=dat.getName();
    $scope.user.emailid=dat.getEmail();
    $http.post('/api/joingoogle',$scope.user)
        .success(function(data) {

                $cookieStore.put("username",$scope.user.uname);
                $cookieStore.put("userid",$scope.user.emailid);
                $window.location.href='../index3.html';

        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}


$scope.signin=function () {
    $http.post('/api/signin',$scope.user)
        .success(function(data) {
            $scope.user.info1 = data;
            if($scope.user.info1!="Your emailid is not recognized!Please try again.") {
                $cookieStore.put("username", data.name);
                $cookieStore.put("userid", data.email);
                $window.location.href = '../index3.html';
            }
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}
    $scope.findlatest=function() {
        $http.get('/api/latest')
            .success(function(data) {

                $scope.todo = data;
                $scope.ifirst=data[0];
                $scope.itwo=data[1];
                $scope.ithree=data[2];
                $scope.ifour=data[3];
                $scope.ifive=data[4];
                $scope.isix=data[5];
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    $scope.deleteadmin=function (id) {
        $scope.abc.title=id.title;
        $scope.abc.user=id.user;
        $http.post('/api/delete',$scope.abc )
            .success(function(data) {
                console.log("deleted");
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    $scope.deleteadminuser=function (id) {
        $scope.abc.uname=id.name;
        $scope.abc.emailid=id.email;
        $http.post('/api/deleteuser',$scope.abc )
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    // delete a todo after checking it
    $scope.delete = function(id) {
    $scope.abc.title=id.title;
        $scope.abc.user=id.user;
        $http.post('/api/delete',$scope.abc )
            .success(function(data) {
                $window.location.href='cart.html';
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
