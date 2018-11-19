

var _animate = false

//Events

function onBoxClick(e, sender)
{
	
	
	var n = 0
	if(sender.innerHTML == "")
		n = 0
	else
		n = sender.innerHTML
	
	
	if (e.button == 0)
	{
		n++;
	}
	else if (e.button == 2)
	{
		if (n == 0)
			n = 10;
		
		n--;
	}
	else
	{
		//do nothing 
	}
	
	if (n <= 0 || n > 9)
	{
		sender.style.color = "black"
		sender.innerHTML = "";
	}
	else
	{
		sender.style.color = "blue"
		sender.innerHTML = n;
	}
	 
}

function onExecute()
{
	//TODO: IF stuck execute bruteforce algorithm
	
	var x = 0
	var y = 0
	var n = 0;
	
	
	
	
	var thread = setInterval(function() {
		
		document.getElementById("lblN").innerHTML = n;
		
		
		
		var box = getBox(x,y);
		
		if(box.getAttribute("class") == "box selected")
		{
			if (n <= 9  && box.innerHTML == "")
			{
				//Process the cell and row
				// this return n == 0  when correct and 10 if there is no correction
				var correctN = n
				n = processBox(n, x, y) 

			
				if (n == 0) //if correct
				{
					box.innerHTML = correctN
					box.setAttribute("class", "box");

					var coord = moveToNextBox(x,y);
					x = coord[0];
					y = coord[1];
					n = 0
				}
				
				if (n > 9)
				{
					if(checkIfStuck())
					{
						alert("stuck")
						clearInterval(thread);
						//TODO: run the brute force
					}
				}
			
			}
			else
			{
				box.setAttribute("class", "box");
				
				if (isSodukoDone())
				{
					alert("done")
					clearInterval(thread);
				}
				
				
				
					
				
				var coord = moveToNextBox(x,y);
				x = coord[0];
				y = coord[1];
				n = 0
				
				
			}
			
			
			
		}
		else{
			box.setAttribute("class", "box selected");
			n = 1
		}
		
		
	}, 0); 
}



// / Events

// this return n == 0  when correct and 10 if there is no correction
var procType = 0
function processBox(n, x, y)
{	
	
	//first check if n is no in row, col or block
	if (procType == 0)
	{
		if (!checkIfNeedProcess(n, x, y))
		{
			n++;
			procType = 0;
			return n;
		}
		else
		{
			procType = 1
		}
	}
	
	if (procType == 1)
	{
		var rowReturn = processRow(n, x, y)
		if (rowReturn != 10)
		{
			clearAllHighLights();
			
			if (rowReturn == 0)
			{
				procType = 0
				n = 0
				return 0;
			}
			
			procType++;
		}
	}
	else if (procType == 2)
	{
		var colReturn = processColumn(n, x, y)
		
		if (colReturn != 10)
		{
			clearAllHighLights();
			
			if (colReturn == 0)
			{
				procType = 0
				n = 0
				return 0;
			}
				
			procType++;
		}
	}
	else if (procType == 3)
	{
		var blokReturn = processBlock(n, x, y)
		
		if (blokReturn != 10)
		{
			clearAllHighLights();
			
			if (blokReturn == 0)
			{
				procType = 0
				n = 0
				return 0;
			}
				
			procType++;
		}
	}
	else{
		n++;
		procType = 0
	}
	  
	  
	return n;
}

function checkIfNeedProcess(n, x, y)
{
	for(var i = 0; i < 9; i++)
	{
		//check in Row
		if (getBox(x,i).innerHTML == n)
		{
			return false;
		}
		
		//check in block
		if (getBox(i,y).innerHTML == n)
		{
			return false;
		}
	}
	
	//check in block
	var block = getBlock(x,y)
	for (var j = 0; j < block.length ; j++)
	{
		if (document.getElementById(block[j]).innerHTML == n)
		{
			return false;
		}
	}
	
	return true;
}

// this return 10 if still busy, return the amount of possibilities
var pRow=0;
var nRow=0;

function processRow(n, x, y)
{
	highlightRow(x, y)
	
	if (nRow < 9)
	{
		if (getBox(nRow,y).innerHTML == "" && nRow != x)
		{
			getBox(nRow,y).style.backgroundColor = "#00FFFF";
			
			var isInCol = false
			
			var block = getBlock(nRow,y)
			for (var j = 0; j < block.length ; j++)
			{
				 if (document.getElementById(block[j]).innerHTML == n)
				 {
					 isInCol = true
				 }
			}
			if (!isInCol)
			{
				for(var i = 0; i < 9; i++)
				{
					if (getBox(nRow,i).innerHTML == n)
					{
						isInCol = true
					}
				}
			}
			
			if (!isInCol)
				pRow++;
		}
		
		nRow++
		return 10;
	}
	else
	{	
		var returnValue = pRow;
		nRow = 0
		pRow = 0
		return returnValue;
	}
	
	
}

// this return 10 if still busy, return the amount of possibilities
var pColum =0;
var nColum =0;
function processColumn(n, x, y)
{
	highlightColumn(x, y)
	
	if (nColum < 9)
	{
		if (getBox(x,nColum).innerHTML == "" && nColum != y)
		{
			getBox(x,nColum).style.backgroundColor = "#00FFFF";
			
			var isInRow = false
			
			var block = getBlock(x, nColum)
			for (var j = 0; j < block.length ; j++)
			{
				if (document.getElementById(block[j]).innerHTML == n)
				{
					 isInRow = true
				}
			}
			
			if (!isInRow)
			{
				for(var i = 0; i < 9; i++)
				{
					if (getBox(i,nColum).innerHTML == n)
					{
						isInRow = true
					}
				}
			}
			
			if (!isInRow)
				pColum++;
		
		}

		nColum++
		return 10;
	}                                                                                                                                                                                         
	else
	{	
		var returnValue = pColum;
		nColum = 0
		pColum = 0
		return returnValue;
	}
	
}


var pBlock =0;
var nBlock =0;
function processBlock(n, x, y)
{
	highlightBlock(x, y);
	
	
	if (nBlock < 9)
	{
		var block = getBlock(x,y);
		var box = document.getElementById(block[nBlock]);
		
		if (box.innerHTML == "" && box.id != x + "_" + y)
		{
			box.style.backgroundColor = "#00FFFF";
		
			var isInBlock = false
			
			for(var i = 0; i < 9; i++)
			{
				var blockY = block[nBlock].substring(2, 3);
				
				
				if (getBox(i,blockY).innerHTML == n)
				{
					getBox(i,blockY).style.backgroundColor = "pink";
					isInBlock = true
				}
			}
			
			if (!isInBlock)
			{
				for(var i = 0; i < 9; i++)
				{
					
					var blockX = block[nBlock].substring(0, 1);
					
					if (getBox(blockX,i).innerHTML == n)
					{
						getBox(blockX,i).style.backgroundColor = "magenta";
						isInBlock = true
					}
				}
			}
			
			if (!isInBlock)
				pBlock++;
		}
		
		
		
		nBlock++
		return 10;
		
		
	}
	else
	{
		var returnValue = pBlock;
		nBlock = 0
		pBlock = 0
		return returnValue;
	}
}


function getBox(row, column)
{
	return document.getElementById(row + "_" + column);
}

 function isSodukoDone()
 {
	 for(var i = 0; i < document.getElementsByClassName("box").length; i++)
	 {
		 if (document.getElementsByClassName("box")[i].innerHTML == "")
			 return false;
	 }
	 
	 return true;
 }
 
 
 var tries = 80;
 var lastEmpty = 0;
 function checkIfStuck()
 {
	 var openBlocks = howManyOpenBlock();
	 if(lastEmpty == openBlocks)
	 {
		 tries = tries - 1;
	 }
	 else
	 {
		 lastEmpty = openBlocks;
		 tries = 80;
		 return false;
	 }
	 
	 document.getElementById("lblTriesLeft").innerHTML = tries;
	 
	 if (tries <= 0)
		 return true;
	 else
		 return false;
	 
 }
 
 function howManyOpenBlock()
 {
	 var returnValue = 0;
	 
	 for(var i = 0; i < document.getElementsByClassName("box").length; i++)
	 {
		 if (document.getElementsByClassName("box")[i].innerHTML == "")
			 returnValue++;
	 }
	 
	 return returnValue;
 }


 
 function moveToNextBox(x, y)
 {
	if (x < 8)
	{
		x++
		
	}
	else
	{
		y++
		if (y > 8)
		{
			y = 0
		}
		x = 0
	}
	 
	return [x,y];
 }
 
 
 function clearAllHighLights()
 {
	for(var i = 0; i < 9; i++)
	{
		for(var j = 0; j < 9; j++)
		{
			getBox(i,j).style.backgroundColor = ""
		}
	}		 
 }
 
 
 function highlightRow(x, y)
 {
	 for(var i = 0; i < 9; i++)
	 {
		 if (x != i)
			getBox(i,y).style.backgroundColor = "#009933"
	 }
 }

 function highlightColumn(x, y)
 {
	 for(var i = 0; i < 9; i++)
	 {
		 if (y != i)
			getBox(x,i).style.backgroundColor = "#009933"
	 }
 }
 
 
 function highlightBlock(x, y)
 {
	 var block = getBlock(x,y);
	 for(var i = 0; i < 9; i++)
	 {
		if (block[i] != x + "_" + y)
			document.getElementById(block[i]).style.backgroundColor = "#009933"
	 }
 }
 
 function getBlock(x,y)
 {
	 
	if ((x >=0 && x <= 2) && (y>=0 && y<=2))
	{
		return ["0_0", "1_0", "2_0","0_1", "1_1", "2_1","0_2", "1_2", "2_2"];
	}

	if ((x >=3 && x <= 5) && (y>=0 && y<=2))
	{
		return ["3_0", "4_0", "5_0","3_1", "4_1", "5_1","3_2", "4_2", "5_2"];
	}

	if ((x >=6 && x <= 9) && (y>=0 && y<=2))
	{
		return ["6_0", "7_0", "8_0","6_1", "7_1", "8_1","6_2", "7_2", "8_2"];
	}

	if ((x >=0 && x <= 2) && (y>=3 && y<=5))
	{
		
		return ["0_3", "1_3", "2_3","0_4", "1_4", "2_4","0_5", "1_5", "2_5"];
	}

	if ((x >=3 && x <= 5) && (y>=3 && y<=5))
	{
		return ["3_3", "4_3", "5_3","3_4", "4_4", "5_4","3_5", "4_5", "5_5"];
	}

	if ((x >=6 && x <= 9) && (y>=3 && y<=5))
	{
		return ["6_3", "7_3", "8_3","6_4", "7_4", "8_4","6_5", "7_5", "8_5"];
	}

	if ((x >=0 && x <= 2) && (y>=6 && y<=8))
	{
		return ["0_6", "1_6", "2_6","0_7", "1_7", "2_7","0_8", "1_8", "2_8"];
	}

	if ((x >=3 && x <= 5) && (y>=6 && y<=8))
	{
		
		return ["3_6", "4_6", "5_6","3_7", "4_7", "5_7","3_8", "4_8", "5_8"];
	}

	if ((x >=6 && x <= 9) && (y>=6 && y<=8))
	{
		return ["6_6", "7_6", "8_6","6_7", "7_7", "8_7","6_8", "7_8", "8_8"];
	}
	 
 }
 
 
 
 //Test Data
 
 function loadTestSoduko()
 {
	 //return
	 
	 getBox(4,0).innerHTML = "5";
	 getBox(4,0).style.color = "blue"
	 getBox(8,0).innerHTML = "6";
	 getBox(8,0).style.color = "blue"
	 getBox(1,1).innerHTML = "5";
	 getBox(1,1).style.color = "blue"
	 getBox(5,1).innerHTML = "1";
	 getBox(5,1).style.color = "blue"
	 getBox(8,1).innerHTML = "7";
	 getBox(8,1).style.color = "blue"
	 getBox(3,2).innerHTML = "6";
	 getBox(3,2).style.color = "blue"
	 getBox(5,2).innerHTML = "4";
	 getBox(5,2).style.color = "blue"
	 getBox(6,2).innerHTML = "3";
	 getBox(6,2).style.color = "blue"
	 getBox(7,2).innerHTML = "1";
	 getBox(7,2).style.color = "blue"
	 getBox(2,3).innerHTML = "8";
	 getBox(2,3).style.color = "blue"
	 getBox(3,3).innerHTML = "2";
	 getBox(3,3).style.color = "blue"
	 getBox(5,3).innerHTML = "5";
	 getBox(5,3).style.color = "blue"
	 getBox(6,3).innerHTML = "1";
	 getBox(6,3).style.color = "blue"
	 getBox(0,4).innerHTML = "9";
	 getBox(0,4).style.color = "blue"
	 getBox(1,4).innerHTML = "7";
	 getBox(1,4).style.color = "blue"
	 getBox(7,4).innerHTML = "2";
	 getBox(7,4).style.color = "blue"
	 getBox(8,4).innerHTML = "3";
	 getBox(8,4).style.color = "blue"
	 getBox(2,5).innerHTML = "5";
	 getBox(2,5).style.color = "blue"
	 getBox(3,5).innerHTML = "9";
	 getBox(3,5).style.color = "blue"
	 getBox(5,5).innerHTML = "7";
	 getBox(5,5).style.color = "blue"
	 getBox(6,5).innerHTML = "8";
	 getBox(6,5).style.color = "blue"
	 getBox(1,6).innerHTML = "4";
	 getBox(1,6).style.color = "blue"
	 getBox(2,6).innerHTML = "2";
	 getBox(2,6).style.color = "blue"
	 getBox(3,6).innerHTML = "8";
	 getBox(3,6).style.color = "blue"
	 getBox(5,6).innerHTML = "9";
	 getBox(5,6).style.color = "blue"
	 getBox(0,7).innerHTML = "7";
	 getBox(0,7).style.color = "blue"
	 getBox(3,7).innerHTML = "4";
	 getBox(3,7).style.color = "blue"
	 getBox(7,7).innerHTML = "5";
	 getBox(7,7).style.color = "blue"
	 getBox(0,8).innerHTML = "8";
	 getBox(0,8).style.color = "blue"
	 getBox(4,8).innerHTML = "6";
	 getBox(4,8).style.color = "blue"
 }
 
 function loadTestSoduko2()
 {
	 //return
	 
	 getBox(2,0).innerHTML = "3";
	 getBox(2,0).style.color = "blue"
	 
	 getBox(3,0).innerHTML = "7";
	 getBox(3,0).style.color = "blue"
	 
	 getBox(1,1).innerHTML = "1";
	 getBox(1,1).style.color = "blue"
	 
	 getBox(3,1).innerHTML = "6";
	 getBox(3,1).style.color = "blue"
	 
	 getBox(8,1).innerHTML = "2";
	 getBox(8,1).style.color = "blue"
	 
	 getBox(1,2).innerHTML = "6";
	 getBox(1,2).style.color = "blue"
	 
	 getBox(3,2).innerHTML = "2";
	 getBox(3,2).style.color = "blue"
	 
	 getBox(6,2).innerHTML = "5";
	 getBox(6,2).style.color = "blue"
	 
	 getBox(7,2).innerHTML = "3";
	 getBox(7,2).style.color = "blue"
	 
	 getBox(0,3).innerHTML = "1";
	 getBox(0,3).style.color = "blue"
	 
	 getBox(2,3).innerHTML = "9";
	 getBox(2,3).style.color = "blue"
	 
	 getBox(8,3).innerHTML = "8";
	 getBox(8,3).style.color = "blue"
	 
	 getBox(2,4).innerHTML = "5";
	 getBox(2,4).style.color = "blue"
	 
	 getBox(3,4).innerHTML = "9";
	 getBox(3,4).style.color = "blue"
	 
	 getBox(4,4).innerHTML = "8";
	 getBox(4,4).style.color = "blue"
	 
	 getBox(5,4).innerHTML = "2";
	 getBox(5,4).style.color = "blue"
	 
	 getBox(6,4).innerHTML = "7";
	 getBox(6,4).style.color = "blue"
	 
	 getBox(0,5).innerHTML = "8";
	 getBox(0,5).style.color = "blue"
	 
	 getBox(6,5).innerHTML = "9";
	 getBox(6,5).style.color = "blue"
	 
	 getBox(8,5).innerHTML = "5";
	 getBox(8,5).style.color = "blue"
	 
	 getBox(1,6).innerHTML = "4";
	 getBox(1,6).style.color = "blue"
	 
	 getBox(2,6).innerHTML = "7";
	 getBox(2,6).style.color = "blue"
	 
	 getBox(5,6).innerHTML = "1";
	 getBox(5,6).style.color = "blue"
	 
	 getBox(7,6).innerHTML = "5";
	 getBox(7,6).style.color = "blue"
	 
	 getBox(0,7).innerHTML = "3";
	 getBox(0,7).style.color = "blue"
	 
	 getBox(5,7).innerHTML = "5";
	 getBox(5,7).style.color = "blue"
	 
	 getBox(7,7).innerHTML = "1";
	 getBox(7,7).style.color = "blue"
	 
	 getBox(5,8).innerHTML = "7";
	 getBox(5,8).style.color = "blue"
	 
	 getBox(6,8).innerHTML = "6";
	 getBox(6,8).style.color = "blue"
	 
	 
	 
	 
 }
 
 
 
//--------------------------
// Brute Force
//--------------------------

var inputBlocks = [];


function onExecuteBruteForce()
{
	
	getInputBlocks();
	console.log(inputBlocks);
	
	console.log(checkIfInputBlock(0,7));
	console.log(checkIfInputBlock(1,3));
	console.log(checkIfInputBlock(1,1));
	
	x = 0;
	y = 0;
	
	
	var box = getBox(x,y);
	box.style.backgroundColor = "#FFA500"
	
	var thread = setInterval(function() {
		
		clearAllHighLights();
		
		
	
		
		box = getBox(x,y);
	
	
	
		box.style.backgroundColor = "#FFA500"
		
		processCurrentBlock();
		
	},100);
	
	
}

function getInputBlocks()
{
	for(var i = 0; i < 9; i++)
	{
		for(var j = 0; j < 9; j++)
		{
			if (getBox(i,j).innerHTML != "")
			{
				inputBlocks.push(getBox(i,j).id);
			}
		}
	}
}

function checkIfInputBlock(x_input,y_input)
{
	return inputBlocks.includes(x_input + '_' + y_input);
}






function processCurrentBlock()
{
	//if checkIfInputBlock	
	if (checkIfInputBlock(x,y))
	{
		//moveOneBlock
		var coord = moveToNextBox(x,y);
		x = coord[0];
		y = coord[1];
	}
	
	
	//getNextAvailableNumber
	
	//if not next number
		//rollbackOne
	//else
		//moveOneBlock
		
	
}


//getInputBlocks (these are the entered blocks before executing) [Done]
//checkIfInputBlock [Done]

//getNextAvailableNumber
//rollbackOne (if block dont have a next available number)
//moveOneBlock
 
 
 
 
 
 