function Graph(){
	this.bounds = [0, 0];
	this.nodes = [];
	this.readFrom = [];  //contains a list with the locations of where the node's inputs come from
	
	/*
	The data variable may contain whatever you want, but it has a few reserved words as follows: 
		(name \ default \ meaning)
		color \ "#fff" \ color of the node
		text \ "" \ node label when drawn
		radius \ 20 \ radius of the node in pixels
		value \ 0 \ not really necessary but used by the default reducer function
		bias \ 0 \ not really necessary but used by the default adjuster function
		reducer \ function(value, selfData, nodeData, connectionData){return value+nodeData.value*connectionData.weight} \ (see next comment)
		adjuster \ function(value, selfData){return value+selfData.bias} \ (see next comment)
	*/
	/*
		For each node in the graph:
      the reducer function goes through each input and updates the value of the node.
	    the adjuster function applies any and all final touches to the node.
	*/
	this.addNode = function(x, y, data){
		if(x+1 > this.bounds[0]) this.bounds[0] = x+1;
		if(y+1 > this.bounds[1]) this.bounds[1] = y+1;
		if(this.nodes[x] == undefined) this.nodes[x] = [];
		data ||= {};
		data.color ||= "#fff";
		data.text ||= "";
		data.radius ||= 20;
		data.value ||= 0;
		data.bias ||= 0;
		data.reducer ||= function(value, selfData, nodeData, connectionData){
			connectionData.text = connectionData.weight;
			return value+nodeData.value*connectionData.weight
		};
		data.adjuster ||= function(value, selfData){
			selfData.text = selfData.bias+value;
			return value+selfData.bias
		};
		this.nodes[x][y] = data;
	};
	/*
	The data variable may contain whatever you want, but it has a few reserved words as follows: 
		(name \ default \ meaning)
		color \ "#000" \ color of the connection
		text \ "" \ label for connection
		weight \ 1 \ not really necessary but used by the default reduce function
	*/
	this.connect = function(xFrom, yFrom, xTo, yTo, data){
		if(this.readFrom[xTo] == undefined) this.readFrom[xTo] = [];
		if(this.readFrom[xTo][yTo] == undefined) this.readFrom[xTo][yTo] = [];
		data ||= {};
		data.color ||= "#000";
		data.text ||= "";
		data.weight ||= 1;
		this.readFrom[xTo][yTo].push([xFrom, yFrom, data]);
	};
	this.update = function(){
		for(var x = 0; x < this.nodes.length; x++){
			if(this.nodes[x]){
				for(var y = 0; y < this.nodes[x].length; y++){
					if(this.nodes[x][y]){
						var currentNode = this.nodes[x][y];
						var value = 0;
						if(this.readFrom[x] && this.readFrom[x][y]){
							for(var connection of this.readFrom[x][y]){  // update value based on inputs and edit input wire visuals
								var connectionData = connection[2];
								var nodeData = this.nodes[connection[0]][connection[1]];
								value = currentNode.reducer(value, currentNode, nodeData, connectionData);
							}
						}
						currentNode.value = currentNode.adjuster(value, currentNode);  // adjust values and edit visuals
					}
				}
			}
		}
	}
	this.display = function(xOff, yOff, width, height, canvas){
		for(var x = 0; x < this.nodes.length; x++){
			if(this.nodes[x]){
				for(var y = 0; y < this.nodes[x].length; y++){
					if(this.nodes[x][y]){
						var currentNode = this.nodes[x][y];
						var xCoord = xOff+(x+1/2)*width/this.bounds[0];
						var yCoord = yOff+(y+1/2)*height/this.bounds[1];
						if(this.readFrom[x] && this.readFrom[x][y]){
							for(var connection of this.readFrom[x][y]){
								var xFrom = xOff+(connection[0]+1/2)*width/this.bounds[0];
								var yFrom = yOff+(connection[1]+1/2)*height/this.bounds[1];
								canvas.strokeStyle = connection[2].color;
								canvas.beginPath();
								canvas.moveTo(xFrom, yFrom);
								canvas.lineTo(xCoord, yCoord);
								canvas.stroke();
								canvas.closePath();
								canvas.fillStyle = "#000";
								canvas.fillText(connection[2].text, (xFrom+xCoord)/2, (yFrom+yCoord)/2);
							}
						}
					}
				}
			}
		}
		for(var x = 0; x < this.nodes.length; x++){
			if(this.nodes[x]){
				for(var y = 0; y < this.nodes[x].length; y++){
					if(this.nodes[x][y]){
						var currentNode = this.nodes[x][y];
						var xCoord = xOff+(x+1/2)*width/this.bounds[0];
						var yCoord = yOff+(y+1/2)*height/this.bounds[1];
						canvas.strokeStyle = "#000";
						canvas.fillStyle = currentNode.color;
						canvas.beginPath();
						canvas.arc(xCoord, yCoord, currentNode.radius, 0, 2*Math.PI);
						canvas.stroke();
						canvas.fill();
						canvas.closePath();
						canvas.fillStyle = "#000";
						canvas.fillText(currentNode.text, xCoord, yCoord);
					}
				}
			}
		}
	};
}
function Graph1d(){
	this.nodes = [];
	
	/*
	The data variable may contain whatever you want, but it has a few reserved words as follows: 
		(name \ default \ meaning)
		color \ "#fff" \ color of the node
		text \ "" \ node label when drawn
		radius \ 20 \ radius of the node in pixels
		value \ 0 \ not really necessary but used by the default reducer function
		bias \ 0 \ not really necessary but used by the default adjuster function
		reducer \ function(value, selfData, nodeData, connectionData){return value+nodeData.value*connectionData.weight} \ (see next comment)
		adjuster \ function(value, selfData){return value+selfData.bias} \ (see next comment)
	*/
	/*
		For each node in the graph:
      the reducer function goes through each input and updates the value of the node.
	    the adjuster function applies any and all final touches to the node.
	*/
	this.addNode = function(data){
		data ||= {};
		data.connections = [];
		data.color ||= "#fff";
		data.text ||= "";
		data.radius ||= 20;
		data.value ||= 0;
		data.bias ||= 0;
		data.reducer ||= function(value, selfData, nodeData, connectionData){
			connectionData.text = connectionData.weight;
			return value+nodeData.value*connectionData.weight
		};
		data.adjuster ||= function(value, selfData){
			selfData.text = selfData.bias+value;
			return value+selfData.bias;
		};
		this.nodes.push(data);
	};
	/*
	The data variable may contain whatever you want, but it has a few reserved words as follows: 
		(name \ default \ meaning)
		text \ "" \ label for connection
		weight \ 1 \ not really necessary but used by the default reduce function
	*/
	this.connect = function(idxFrom, idxTo, data){
		data ||= {};
		data.text ||= "";
		data.weight ||= 1;
		this.nodes[idxTo].connections.push([idxFrom, data]);
	};
	this.update = function(){
		for(var x = 0; x < this.nodes.length; x++){
			if(this.nodes[x]){
				var currentNode = this.nodes[x];
				var value = 0;
				for(var connection of currentNode.connections){ // update value based on inputs and edit input wire visuals
					var connectionData = connection[1];
					var nodeData = this.nodes[connection[0]];
					value = currentNode.reducer(value, currentNode, nodeData, connectionData);
				}
				currentNode.value = currentNode.adjuster(value, currentNode); //adjust value and edit visuals
			}
		}
	}
	this.display = function(xOff, yOff, width, height, canvas){
		for(var x = 0; x < this.nodes.length; x++){  // draw the wires
			if(this.nodes[x]){
				var currentNode = this.nodes[x];
				var xCoord = xOff+(x+1/2)*width/this.nodes.length;
				for(var connection of currentNode.connections){
					var xFrom = xOff+(connection[0]+1/2)*width/this.nodes.length;
					canvas.strokeStyle = "#ff0000";
					canvas.beginPath();
					canvas.moveTo(xFrom, yOff+height*2/3);
					canvas.lineTo((xFrom+xCoord)/2, yOff+height*1/3);
					canvas.stroke();
					canvas.closePath();
					canvas.strokeStyle = "#0000ff";
					canvas.beginPath();
					canvas.moveTo((xFrom+xCoord)/2, yOff+height*1/3);
					canvas.lineTo(xCoord, yOff+height*2/3);
					canvas.stroke();
					canvas.closePath();
					canvas.fillStyle = "#000";
					canvas.fillText(connection[1].text, (xFrom+xCoord)/2, yOff+height*1/2);
				}
			}
		}
		for(var x = 0; x < this.nodes.length; x++){  // draw the nodes over the wires
			if(this.nodes[x]){
				var currentNode = this.nodes[x];
				var xCoord = xOff+(x+1/2)*width/this.nodes.length;
				canvas.strokeStyle = "#000";
				canvas.fillStyle = currentNode.color;
				canvas.beginPath();
				canvas.arc(xCoord, yOff+height*2/3, currentNode.radius, 0, 2*Math.PI);
				canvas.stroke();
				canvas.fill();
				canvas.closePath();
				canvas.fillStyle = "#000";
				canvas.fillText(currentNode.text, xCoord, yOff+height*2/3);
			}
		}
	};
}
function FastGraph(){   ///// NOT COMPLETED

  /*******
    This graph works like the normal graph, but it keeps track of updates and uses them to streamline the simulation.
    
    This is good for things that have a set number of possible values. If the values are
    either 0 or 1 and have a 5% chance of changing, not all nodes need to be updated.
    
    This graph also keeps track of whether or not any updates have happened, so it can detect
    whether the graph has settled into a steady state.
  *******/


	//use delete operator to remove updates
	//use x and y coordinates separated by a comma
	this.updates = {};
	this.nodes = [];
	//contains a list with the locations of where the node's inputs come from.
	//also states whether or not the node needs an update.
	this.nodeIn = [];
	//contains a list of locations that the node drives.
	//also states the previous value of the node at index.
	this.nodeOut = [];
	this.addNode = function(node){
		
	};
	this.connect = function(xFrom, yFrom, xTo, yTo, color, data){
		//add places for the connections to go if they do not already exist
		if(this.nodeOut[xTo] == undefined) this.nodeOut[xTo] = [];
		if(this.nodeOut[xTo][yTo] == undefined) this.nodeOut[xTo][yTo] = [];
		if(this.nodeIn[xFrom] == undefined) this.nodeIn[xFrom] = [];
		if(this.nodeIn[xFrom][yFrom] == undefined) this.nodeIn[xFrom][yFrom] = [];
		
		
		
		
	};
	this.display = function(x, y, width, height, canvas){
		
	};
}
