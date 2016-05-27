/*	
			
	| Angular Blog Setup |
	Pretty basic Angular Functionality


	This will be the main object to access our static content
	When this controller loads, it will load all of the static
	information we have added to the site under the categories
	folder. 

	Add any folder you would like as a category

	/user/categories
				    \
				    [category name]
				   	 			   \
				   				    [item name]
				   				  	 		  \
				   				   			  index.md
				   				   			  image1.png
				   				   			  image2.png
					
	It will build a directory List of the category names, 
	then iterate over that list to grab the items and their
	content.
	Next, it parses the index.md. 
		The top section between the --- is metadata.
		The remaining is markdown which will be put into 
		a string and converted to HTML.
		You can also use HTML instead of Markdown.

	After that you can access the blog array anywhere in the 
	application by using Blog.blog and then dot notation to the 
	desired category. A typical setup is like this:
		
		In views/main.html
		
		<div ng-repeat="event in Blog.blog.events">
			<div ng-include="{{ event.template }}"></div>
		</div>
*/





'use strict';

var app = angular.module('codeforfoco');

app.controller('Blog', ['$scope', '$http', Blog]);


function Blog($scope, $http){

	//DEFINE ACCESSABLE VARIABLES-----------------
		var vm = this;
		vm.blog = [];
		vm.title = "HELLO";
		vm.numOfPosts = 6;
		vm.curPost = [];
		vm.isPostShowing = false;
	//DEFINE ACCESSABLE FUNCTIONS-----------------
		vm.viewPost = viewPost;


	//ACCESSABLE FUNCTIONS------------------------
		function viewPost(postUrl){
			
			//Get our url equivilant of our vm.blog object
			var postInfo = postUrl.split('/');
			postInfo.pop();
			postInfo.shift();

			console.log("PostInfo: ", postInfo);
			var posts = vm.blog[postInfo[2]].posts;

			for (var post in posts){
				if(posts[post].name == postInfo[3]){
					vm.curPost = posts[post];
				}
			}
			
			vm.isPostShowing = true;
			console.log(vm.isPostShowing);
		}
	


	//CONTROLLER FUNCTIONS------------------------
		//constructor functions
		//these allow building a new Category object
		//within our namespace... which in this case is
		//vm.blog
		//So you use vm.blog[categoryName] = new Category(name, local)
		//syntax to assign a name. You can do this to the global scope
		//as well (window), but of course you shouldn't want to. 
		//It doesn't work as a String variable, you HAVE to use the
		//namespace to build the object on, this allows you to 
		//assign the name.
		function Category(name, local){
			return {
				name : name,
				localDir : local,
				posts : []
			};
		};

		//Grabs the categories under /user/categories/
		//and builds objects to represent them
		function buildMaThang(){
			
			$http({
			    method: "GET",
			    url : "/user/categories/", // !!DO NOT CHANGE!!
			    }).then(function (data) {
			    	
			    	//Find each href attribute and push it's value to an array
			    	var itemList = []; //Use this later for the Local URL
			        $(data.data).find("a").attr("href", function (i, val) {
			        	itemList.push(val);
			        });
			        
			        //Clean up the first and last positions of our array
			        //because we don't need them.
			        itemList.pop();
			        itemList.shift();
			        
			        //get the directory names out of the hrefs
			        var catNames = [];
			        for(var i = 0; i <= itemList.length-1; i++){
			        	var catName = itemList[i].replace(/\/|user|categories|/gi,"");
			        	//Create a new Category(object) within our namespace
			        	// and give it the name of the category
			        	vm.blog[catName] = new Category(catName, itemList[i]);
			        	catNames.push(catName);
			        }
			        return [itemList, catNames];//return array

				}).then(function(category){
				//AND THEN...

					angular.forEach(category[0], function(itemUrl, index){
				  		
				  		$http({url: itemUrl, method: "GET"})
				  		.then(function(data) {
					    	
					    	var postList = [];
					    	$(data.data).find("a").attr("href", function (i, val) {
					    		postList.push(val);
					    	});
					    	postList.pop();
			        		postList.shift();

			        		
			        		for(var i = 0; i <= postList.length-1; i++){
			        			var postName = postList[i].replace(/\/|user|categories|/gi,"");
					    		postName = postName.replace(category[1][index], "");
					    		var curCat = category[1][index];
					    		
					    		//vm.blog[curCat].posts[postName] = new Post(name, postList[i]);
					    		postName = {
					    			name: postName,
					    			localUrl: postList[i],
					    			metadata: {},
					    			content: ""
					    		}
					    		vm.blog[curCat].posts.push(postName);
					    	}

					    	return [postList];
				  		})
				  		.then(function(postList){
				  		//AND THEN... 

				  			angular.forEach(postList, function(postUrls){
				  				
				  				//stupid hack cause we can't get objects length
				  				var count=0;
				  				for (var i in postUrls) {
							    	if (postUrls.hasOwnProperty(i)) {
							        	count++;
								    }
								}
				  				if(count > 0){
				  				
				  				angular.forEach(postUrls, function(postUrl){
					  				//console.log("\n---", postUrl ,"---\n");//Test

					  				//Add index.md to our url
					  				var postUrlI = postUrl + "index.md";
					  					

				  					//if we were successful, then we need to get the
				  					//post category to build a way to reference our object.
				  					//Yes, I know this should be implemented different
				  					//with the promises, but async issues and time...
				  					var postCat = postUrl.split("/");
				  					postCat.pop();
				  					postCat.shift();
				  					var postPosition = 0;


				  					var currentCategoryPosts = vm.blog[postCat[2]].posts;
				  					
				  					for(var i = 0; i <= currentCategoryPosts.length-1; i++){
				  						if(postCat[3] === currentCategoryPosts[i].name){
				  							postPosition = i;
				  						}
				  					}
				  					//console.log("Ppos: ", postPosition);

					  				//Get url from file
					  				$http({url: postUrlI, method: "GET"})
					  				.then(function(data) {

						  				//Split our data into 2 arrays
						  				// 0 - metadata
						  				// 1 - markdown/html
							    		var textFile = data.data.split("---");

						    			//Build metadata object from our file
						    			var metadataArray = textFile[0].split('\n');
						    			//Remove any empty strings
						    			for(var i = 0; i <= metadataArray.length; i++){
						    				if(metadataArray[i] == "" || metadataArray[i] == null || metadataArray == undefined){
						    					metadataArray.splice(i,1);
						    				}
						    			}
						    			
						    			// Now that we have the metadata strings cleaned up, we can
						    			// loop through the # of posts and assign the related metadata
						    			// to that posts's metadata object
						    			for(var j = 0; j <= metadataArray.length-1; j++){
						    					
					    					//Split metadata
					    					var metaKeyValue = metadataArray[j].split(/:/);//.split(":");
					    					//Get rid of any spaces at the front and end
					    					metaKeyValue[0] = metaKeyValue[0].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
					    					metaKeyValue[1] = metaKeyValue[1].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
					    					//Metadata is ready!
					    					//add it to our metadata object
						    				//vm.blog[postCat[2]].posts[postCat[3]].metadata[metaKeyValue[0]] = metaKeyValue[1];
						    				vm.blog[postCat[2]].posts[postPosition].metadata[metaKeyValue[0]] = metaKeyValue[1];
						    				
						    				//Now handle our Markdown which is the 2nd part of our textFile
						    				var converter = new Showdown.converter();
											var content = converter.makeHtml(textFile[1]);
											//assign it to our post object
											vm.blog[postCat[2]].posts[postPosition].content = content;
						    			}
					    			});//End $http promise
				  				});//End 2nd for each
				  				}
				  			});
				  		});//End then of 2nd http
					});//end 1st angular.forEach
				//console.log("BLOG: ", vm.blog);//Testing			
				}).catch(function(error){
					console.log("ERROR", error);
					console.log("Dude! Don't forget the fortune cookies.\n");
					console.log("AND THEN...\n");
					console.log("You say AND THEN one more time...");
				});				
		
		};//End build Categories

			    	
			

	//Begin the build process	
	buildMaThang();

}; //END CONTROLLER
