// Handle all directories and markdown files

var app = angular.module('codeforfoco');

app.service( 'handleFiles', [handleFiles]);

function handleFiles(){
	return {


		getCategoryList : function(categoryName){
			
			//Our root directory we are working from
			var theURL = "/articles/" + categoryName;

			$.ajax({
			    url : theURL,
			    method: "GET",
			    success: function (data) {
			    	
			    	var itemList = [];
			        var folderContent = $(data).find("a").attr("href", function (i, val) {
			        	itemList.push(val);
			        });

			        //Clean up the first and last positions of our array
			        itemList.pop();
			        itemList.shift();
			        //console.log("Itemlist: ", itemList);
			        return itemList;
			    },
			    error: function(err){
			    	return err;
			    }
			});

		},

		getMarkdown : function(mdURL){
	    	$.ajax({
			  method: "GET",
			  url: mdURL,
			  success: function(md) {
			  	console.log(md);
			    var newHtml = this.markDownToHTML(md);
			    console.log(newHtml);
			    return newHtml;
			  },
			  error: function(err){
			    console.log("FAIL", err);
			  }
			});
	    },
	    markDownToHTML : function(md){
			var converter = new Showdown.converter();
			var html = converter.makeHtml(md);
	    	return html;
	    }
	};//End of Return

}; //End of 