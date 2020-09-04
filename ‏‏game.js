//import {Board} from "./board.js";

function draughtsUI(boardId){
    
    this.selected=false;
    this.selectedPlaceId;
    this.initBoardUI=function(){
        const board=document.getElementById(boardId);
        let isWhiteBox=true;
        let counter=0;
        for (let i=1;i<=64;i++){
            let newBox=document.createElement('div');
            newBox.id=mergeBoxAndBoardID(i,boardId);
            newBox.classList.add('box');
            newBox.classList.add(isWhiteBox?'white':'black');   
            newBox.addEventListener('click',()=>{this.selectedPlaceId=separateBoxIdFromBoardId(newBox.id)});
            newBox.addEventListener('click',()=>{this.selected=true});
            newBox.addEventListener('click',()=>{newBox.classList.add('green')});
            board.appendChild(newBox);
            counter++;
            isWhiteBox=!isWhiteBox;
            if (counter===8){
                isWhiteBox=!isWhiteBox;
                counter=0;
            }
        }  
    },
    this.cleanSigns=function(boardId){
        for (let i=1;i<=64;i++){
            let id = mergeBoxAndBoardID(i,boardId)
            document.getElementById(id).style.pointerEvents = 'none';
            document.getElementById(id).classList.remove('green-border');
        }
    },
    this.updateUI=function (board){
        for (let id=1;id<=64;id++){
                let idUI=mergeBoxAndBoardID(id,boardId);
                document.getElementById(idUI).classList.remove('green');
                let currentPlace=board.getPlaceInfo(id);
                let currentPlaceDOM=document.getElementById(idUI);
                if (board.getPlaceInfo(id)==undefined){continue;}
                if(currentPlaceDOM.getElementsByTagName('img').length>0){
                    currentPlaceDOM.removeChild(currentPlaceDOM.lastChild);
                }

                if(!currentPlace.isEmpty){
                    if(currentPlace.isWhite){
                            let whitePieceImg=document.createElement('img');
                            whitePieceImg.classList.add("piece");
                            whitePieceImg.classList.add("white-color");
                            if(currentPlace.isKing){
                                whitePieceImg.src="./sources/whiteKing.png";
                            }
                            else{
                                whitePieceImg.src="./sources/whitePiece.png";
                            }
                            document.getElementById(idUI).appendChild(whitePieceImg);     
                    }
                    if(!currentPlace.isWhite){
                        let blackPieceImg=document.createElement('img');
                        blackPieceImg.classList.add("piece");
                        blackPieceImg.classList.add("black-color");
                        if(currentPlace.isKing){
                            blackPieceImg.src="./sources/blackKing.png";
                        }
                        else{
                            blackPieceImg.src="./sources/blackPiece.png";
                        }
                        document.getElementById(idUI).appendChild(blackPieceImg);
                        
                    }
                }    
        } 
    },
    this.enableOnlyValidSources=function (movesCollection){
        for (let i=1;i<=64;i++){
            let id=mergeBoxAndBoardID(i,boardId);
            document.getElementById(id).style.pointerEvents = 'none';
            document.getElementById(id).classList.remove('green-border');
            document.getElementById(id).classList.remove('orange-border');
        }
        for (let boxId of movesCollection.keys){
            placeId=mergeBoxAndBoardID(boxId,boardId);
            document.getElementById(placeId).style.pointerEvents = 'auto';
            document.getElementById(placeId).classList.add('green-border');
        }
        console.log("sources: ",movesCollection.keys);//temp
    },
    this.enableOnlyValidDestinations=function (movesCollection,sourceId){

        for (let i=1;i<=64;i++){
            let id=mergeBoxAndBoardID(i,boardId);
            document.getElementById(id).style.pointerEvents = 'none';
            document.getElementById(id).classList.remove('green-border');
        }

        for (let destinationId of movesCollection.getOptionalDestinationsById(sourceId)){
            if (!Array.isArray(destinationId)){//regular move
                destinationId=mergeBoxAndBoardID(destinationId,boardId);
                document.getElementById(destinationId).style.pointerEvents = 'auto';
                document.getElementById(destinationId).classList.add('green-border');
            }
            else{//beating
                let beatingPath=destinationId;
                for (let i=0;i<(beatingPath.length-1);i++){
                    let middleStage=mergeBoxAndBoardID(beatingPath[i],boardId);
                    document.getElementById(middleStage).classList.add('orange-border');
                }
                let beatingDestination=beatingPath[beatingPath.length-1];
                beatingDestination=mergeBoxAndBoardID(beatingDestination,boardId);
                document.getElementById(beatingDestination).style.pointerEvents = 'auto';
                document.getElementById(beatingDestination).classList.add('green-border');
            }
            
                
        }
        console.log("destinations: ",movesCollection.getOptionalDestinationsById(sourceId));//temp
    }
    const mergeBoxAndBoardID=function(boxId,boardId){
        return boxId+'-'+boardId;
    }
    const separateBoxIdFromBoardId=function(idUI){
        return idUI.substr(0, idUI.indexOf('-')); 
    }

    
}



const draughtsGame=function(boardId){

    function boardInfo(){
        //init
        let rows=[],counter=0,isBlackBox=false,currentRow=[];
        for (let id=1;id<=64;id++){
            if (isBlackBox){
                this[id]= {
                isEmpty: (id<25||id>40)?false:true,
                isWhite: (id<25)?true:false,
                isKing: false
                };
                currentRow.push({[id]:this[id]});//{id: {isEmpty,isWhite,isKing}}
            }
            else{
                currentRow.push({[id]:{}})
            }
            counter++;
            isBlackBox=!isBlackBox;
            if (counter===8){
                rows.push(currentRow);
                counter=0;
                currentRow=[];
                isBlackBox=!isBlackBox;
            }
        }
        this.rows=rows,
        
        this.getPlaceInfo=function(id){
            return this[id];
        },
        this.addPiece=function(id,isEmpty,isWhite,isKing){
            this[id]={
                isEmpty: isEmpty,
                isWhite: isWhite,
                isKing: isKing
            }
        },
        this.removePiece=function(id){
        this[id]={
                isEmpty: true,
                isWhite: false,
                isKing: false
        };
        },
        this.isEmpty=function(id){
            return this[id].isEmpty;
        },
        this.isPieceWhiteById=function(id){
            return this[id].isWhite;
        },
        this.isKing=function(id){
            return this[id].isKing;
        },
        this.isEmptyByLocation=function(location){
            let id=this.getIdByLocation(location);
            return this[id].isEmpty;
        },
        this.isPieceWhiteByLocation=function(location){
            let id=this.getIdByLocation(location);
            return this[id].isWhite;
        },
        this.getIdByLocation=function(location){
            if (location instanceof Location){
                return Object.keys(this.rows[location.row][location.column])[0];
            }
        },
        this.getLocationById=function(id){
            for (let row=0;row<8;row++){
                for (let column=0;column<8;column++){
                    if((Object.keys(this.rows[row][column])[0])==id){
                        return new Location(row,column);
                    }
                }
            }
        },
        this.getAmountOfPiecesOnBoard=function(){
            let amount=0;
            for (let id=1;id<=64;id++){
                if (this.getPlaceInfo(id)!=undefined){
                    if(!this[id].isEmpty){
                        amount++;
                    }
                }
            }
            return amount;
        },
        this.isGameOver=function (movesCollection,isWhiteTurn){
            //no piece of one kind
            let isOnePieceExists=false;
            for (let id=1;id<=64;id++){
                if (this.getPlaceInfo(id)!=undefined){
                    if(!this[id].isEmpty){
                        if(this[id].isWhite==isWhiteTurn){
                            isOnePieceExists=true;
                        }
                    }
                }
            }

            //no places to move
            if (movesCollection.length===0){
                return true;
            }
            
            return !isOnePieceExists;
        },
        //Moves Execution
        this.executeRegularMove=function (sourceId,destinationId){
            this.addPiece(destinationId,this.isEmpty(sourceId), 
                                        this.isPieceWhiteById(sourceId),
                                        this.isKing(sourceId));
            this.removePiece(sourceId);
        },
        this.executeSingleBeating=function (sourceId,destinationId){ 
            
            let capturedLocationId=this.getLocationIdBetweenTwoMovingPoints(sourceId,destinationId);
            let movingPieceInfo=this.getPlaceInfo(sourceId);
            
            this.removePiece(sourceId);
            this.addPiece(destinationId,movingPieceInfo.isEmpty,movingPieceInfo.isWhite,movingPieceInfo.isKing);
            
            this.removePiece(capturedLocationId);

            gameUI.updateUI(this);
            //return new Promise((resolve)=>{});
            // console.log("here",(new Date()).getSeconds());
            //gameUI.cleanSigns(this);
            
        },
        this.executeFullBeatingMove= async function (sourceId,beatingStations){
            let currentLocation=sourceId;
            for (let station of beatingStations){
                
                this.executeSingleBeating(currentLocation,station);
                if(beatingStations.length>1){
                    gameUI.updateUI(this);
                    await sleep(400);
                }
                
                currentLocation=station;

                
            }
        },
        this.getLocationIdBetweenTwoMovingPoints=function (sourceId,destinationId){
            //the difference between two places id is 7 or 9
            if (destinationId-sourceId===18){
                return destinationId-9;
            }
            if (destinationId-sourceId===14){
                return destinationId-7;
            }
            if (destinationId-sourceId===-18){
                return parseInt(destinationId)+9;
            }
            if (destinationId-sourceId===-14){
                return parseInt(destinationId)+7;
            }
        },
        this.executeMove= async function (sourceId,destinationId){
            if ((Math.abs(destinationId-sourceId)!=9) && (Math.abs(destinationId-sourceId)!=7)){
                //beating
                let beatingPath=this.beatingMovesCollection.getBeatingPath(sourceId,destinationId);
                await this.executeFullBeatingMove(sourceId,beatingPath);
            }
            else{//regular move
                this.executeRegularMove(sourceId,destinationId);
            }  
            if(this.isPieceNeedToBecomeKing(destinationId)){
                this.createNewKing(destinationId,this.isPieceWhiteById(destinationId))
            }

            return sleep(0);
        },
        //King
        this.isPieceNeedToBecomeKing=function(id){
            let pieceInfo=this.getPlaceInfo(id);
            if (id<9){
                if((!pieceInfo.isWhite) &&(!pieceInfo.isKing)){
                    return true;
                }
            }
            if (id>56){
                if((pieceInfo.isWhite) &&(!pieceInfo.isKing)){
                    return true;
                }
            }
            return false;
        },
        this.createNewKing=function (locationId,isWhite){
            this.removePiece(locationId);
            this.addPiece(locationId,false,isWhite,true);
            console.log("New KING: ",this.getPlaceInfo(locationId));
        },

        this.isSourceValid=function (sourceId,isWhiteTurn){
            if ((!this.isEmpty(sourceId)) 
                && (this.isPieceWhiteById(sourceId)==isWhiteTurn)){
                return true;
            }
            else{
                return false;
            }       
        },

        this.isRightBottomBeatingPossible=function(sourceLocation,isWhiteTurn){
            let optionalDestinationLocation;
            try{
                optionalDestinationLocation=sourceLocation.rightBottom().rightBottom();
            }catch(e){
                if (e instanceof OutOfBoardError){}
            }
    
            if (optionalDestinationLocation instanceof Location){//if out of board
            let optionalOpponentPieceLocation=sourceLocation.rightBottom();
                if (!this.isEmptyByLocation(optionalOpponentPieceLocation)){
                    if (this.isPieceWhiteByLocation(optionalOpponentPieceLocation)!=isWhiteTurn){//if found opponent
                        if (this.isEmptyByLocation(optionalDestinationLocation)){//if next box is empty    
                            return true;                    
                        }
                    }
                }        
            }
            return false;
        },
        this.isLeftBottomBeatingPossible=function(sourceLocation,isWhiteTurn){
            let optionalDestinationLocation;
            try{
                optionalDestinationLocation=sourceLocation.leftBottom().leftBottom();
            }catch(e){
                if (e instanceof OutOfBoardError){}
            }
            if (optionalDestinationLocation instanceof Location){//if out of board
            let optionalOpponentPieceLocation=sourceLocation.leftBottom();
            
                if (!this.isEmptyByLocation(optionalOpponentPieceLocation)){
                    if (this.isPieceWhiteByLocation(optionalOpponentPieceLocation)!=isWhiteTurn){//if found opponent
                        if (this.isEmptyByLocation(optionalDestinationLocation)){//if next box is empty    
                            return true;                    
                        }
                    }
                }        
            }
            return false;
        },
        this.isRightTopBeatingPossible=function(sourceLocation,isWhiteTurn){
            let optionalDestinationLocation;
            try{
                optionalDestinationLocation=sourceLocation.rightTop().rightTop();
            }catch(e){
                if (e instanceof OutOfBoardError){}
            }
    
            if (optionalDestinationLocation instanceof Location){//if out of board
            let optionalOpponentPieceLocation=sourceLocation.rightTop();
            
                if (!this.isEmptyByLocation(optionalOpponentPieceLocation)){
                    if (this.isPieceWhiteByLocation(optionalOpponentPieceLocation)!=isWhiteTurn){//if found opponent
                        if (this.isEmptyByLocation(optionalDestinationLocation)){//if next box is empty    
                            return true;                    
                        }
                    }
                }        
            }
            return false;
        },
        this.isLeftTopBeatingPossible=function(sourceLocation,isWhiteTurn){
            let optionalDestinationLocation;
            try{
                optionalDestinationLocation=sourceLocation.leftTop().leftTop();
            }catch(e){
                if (e instanceof OutOfBoardError){}
            }
    
            if (optionalDestinationLocation instanceof Location){//if out of board
            let optionalOpponentPieceLocation=sourceLocation.leftTop();
                if (!this.isEmptyByLocation(optionalOpponentPieceLocation)){
                    if (this.isPieceWhiteByLocation(optionalOpponentPieceLocation)!=isWhiteTurn){//if found opponent
                        if (this.isEmptyByLocation(optionalDestinationLocation)){//if next box is empty    
                            return true;                    
                        }
                    }
                }        
            }
            return false;
        };

        this.regularMovesCollection=Object.create(movesCollection);
        this.beatingMovesCollection=Object.create(movesCollection);

        //Collections = Possible Moves
        this.createPossibleRegularMovesCollection=function (isWhiteTurn){
            for (let id=1;id<=64;id++){
                if (this.getPlaceInfo(id)==undefined || this.isEmpty(id)){continue;}

                if (this.isPieceWhiteById(id)==isWhiteTurn){
                    let currentLocation=this.getLocationById(id);
                    let optionalDestinationLocation;
                    //white
                    if (isWhiteTurn || this.isKing(id)){
                        //right regular
                        this.createWhiteRegularMovesCollection(id,currentLocation);

                    }
                    //black
                    if ((!isWhiteTurn) || this.isKing(id)){
                        this.createBlackRegularMovesCollection(id,currentLocation);
                    }
                }
            }

        },
        this.createPossibleBeatingMovesCollection=function (isWhiteTurn){
            for (let id=1;id<=64;id++){
                if (this.getPlaceInfo(id)==undefined || this.isEmpty(id)){continue;}//if not empty

                if (this.isPieceWhiteById(id)==isWhiteTurn){
                    
                    let beatingStations=[];
                    //king
                    if (this.isKing(id)){
                        this.collectKingBeatingOptions(id,beatingStations)
                    }
                    //white
                    else if (isWhiteTurn){
                        this.collectWhiteBeatingOptions(id,beatingStations); 
                    }
                    //black
                    else{
                        this.collectBlackBeatingOptions(id,beatingStations);
                    }
                }
            }

        },
        this.getMovesCollection=function (){

            return ((this.beatingMovesCollection.length>0)?this.beatingMovesCollection:this.regularMovesCollection);
        },
        //get beatingPath that starts at sourceId and checks if there is an extended path already
        this.isExtendedPathExists=function (sourceId,beatingPath){
            let allPaths=this.beatingMovesCollection.getOptionalDestinationsById(sourceId);
            if(allPaths==null){return false;}
            for (let path of allPaths){
                if (path.slice(0,path.length-1).includes(beatingPath[beatingPath.length-1])){
                    return true;
                }
            }
            return false;
        },

        this.createWhiteRegularMovesCollection=function(id,currentLocation){
            let optionalDestinationLocation;
            //right regular
            if (currentLocation.column!=7 && currentLocation.row!=7){
                optionalDestinationLocation=currentLocation.rightBottom();
                let optionalDestinationId=this.getIdByLocation(optionalDestinationLocation);
                if (this.isEmpty(optionalDestinationId)){
                    this.regularMovesCollection.add(id,optionalDestinationId);
                }
            }
            //left regular
            if (currentLocation.column!=0 && currentLocation.row!=7){
                optionalDestinationLocation=currentLocation.leftBottom();
                let optionalDestinationId=this.getIdByLocation(optionalDestinationLocation);
                if (this.isEmpty(optionalDestinationId)){
                    this.regularMovesCollection.add(id,optionalDestinationId);
                }
            }
        },
        this.createBlackRegularMovesCollection=function(id,currentLocation){
            //right regular
            if (currentLocation.column!=7 && currentLocation.row!=0){
                optionalDestinationLocation=currentLocation.rightTop();
                let optionalDestinationId=this.getIdByLocation(optionalDestinationLocation);
                if (this.isEmpty(optionalDestinationId)){
                    this.regularMovesCollection.add(id,optionalDestinationId);
                }
            }
            //left regular
            if (currentLocation.column!=0 && currentLocation.row!=0){
                optionalDestinationLocation=currentLocation.leftTop();
                let optionalDestinationId=this.getIdByLocation(optionalDestinationLocation);
                if (this.isEmpty(optionalDestinationId)){
                    this.regularMovesCollection.add(id,optionalDestinationId);
                }
            }
        }
        //stations = the destinations as part of the whole "beating path"
        this.collectWhiteBeatingOptions=function (sourceId,stations){
            let lastStation=stations[stations.length-1];
            let sourceLocation=(stations.length>0)?this.getLocationById(lastStation):this.getLocationById(sourceId);
            if(this.isRightBottomBeatingPossible(sourceLocation,isWhiteTurn)){
                let optionalDestinationLocation=sourceLocation.rightBottom().rightBottom();
                let destinationId=this.getIdByLocation(optionalDestinationLocation);
                let updatedStations=stations.concat(destinationId);
                console.log(`beating s: ${sourceId}, d:${destinationId}`);
                this.collectWhiteBeatingOptions(sourceId,updatedStations);
            }
            if(this.isLeftBottomBeatingPossible(sourceLocation,isWhiteTurn)){
                let optionalDestinationLocation=sourceLocation.leftBottom().leftBottom(); 
                let destinationId=this.getIdByLocation(optionalDestinationLocation);
                let updatedStations=stations.concat(destinationId);
                console.log(`beating s: ${sourceId}, d:${destinationId}`);
                this.collectWhiteBeatingOptions(sourceId,updatedStations);
                return;
            }
            if (stations.length>0){
                console.log('beating options: ',sourceId, stations);
                if (!this.isExtendedPathExists(sourceId,stations)){
                    this.beatingMovesCollection.add(sourceId,stations);
                }
            }
        },
        this.collectBlackBeatingOptions=function (sourceId,stations){
            let lastStation=stations[stations.length-1];
            let sourceLocation=(stations.length>0)?this.getLocationById(lastStation):this.getLocationById(sourceId);
            if (this.isRightTopBeatingPossible(sourceLocation,isWhiteTurn)){
                let optionalDestinationLocation=sourceLocation.rightTop().rightTop();
                let destinationId=this.getIdByLocation(optionalDestinationLocation);
                let updatedStations=stations.concat(destinationId);
                console.log(`beating! s: ${sourceId}, d:${destinationId}`);
                this.collectBlackBeatingOptions(sourceId,updatedStations);
            }
            if (this.isLeftTopBeatingPossible(sourceLocation,isWhiteTurn)){
                let optionalDestinationLocation=sourceLocation.leftTop().leftTop();
                let destinationId=this.getIdByLocation(optionalDestinationLocation);
                let updatedStations=stations.concat(destinationId);
                console.log(`beating s: ${sourceId}, d:${destinationId}`);
                this.collectBlackBeatingOptions(sourceId,updatedStations);
                return;
            }
            if (stations.length>0){
                console.log('beating options: ',sourceId, stations);
                if (!this.isExtendedPathExists(sourceId,stations)){
                    this.beatingMovesCollection.add(sourceId,stations);
                } 
            }
        }
        this.collectKingBeatingOptions=function (sourceId,stations,lastSourceId){
            let lastStation=stations[stations.length-1];
            let sourceLocation=(stations.length>0)?this.getLocationById(lastStation):this.getLocationById(sourceId);
            if (lastSourceId==undefined){lastSourceId=sourceId;};

            if(this.isRightBottomBeatingPossible(sourceLocation,isWhiteTurn)){
                let optionalDestinationLocation=sourceLocation.rightBottom().rightBottom();
                let destinationId=this.getIdByLocation(optionalDestinationLocation);
                if(lastSourceId!=destinationId){
                    let updatedStations=stations.concat(destinationId);
                    console.log(`beat s: ${sourceId}, d:${destinationId}`);
                    this.collectKingBeatingOptions(sourceId,updatedStations,this.getIdByLocation(sourceLocation));
                }
            }
            if(this.isLeftBottomBeatingPossible(sourceLocation,isWhiteTurn)){  
                let optionalDestinationLocation=sourceLocation.leftBottom().leftBottom(); 
                let destinationId=this.getIdByLocation(optionalDestinationLocation);
                if(lastSourceId!=destinationId){
                    let updatedStations=stations.concat(destinationId);
                    console.log(`beat s: ${sourceId}, d:${destinationId}`);
                    this.collectKingBeatingOptions(sourceId,updatedStations,this.getIdByLocation(sourceLocation));
                }
            }
            if (this.isRightTopBeatingPossible(sourceLocation,isWhiteTurn)){
                let optionalDestinationLocation=sourceLocation.rightTop().rightTop();
                let destinationId=this.getIdByLocation(optionalDestinationLocation);
                if(lastSourceId!=destinationId){
                    let updatedStations=stations.concat(destinationId);
                    console.log(`beat s: ${sourceId}, d:${destinationId}`);
                    this.collectKingBeatingOptions(sourceId,updatedStations,this.getIdByLocation(sourceLocation));
                }
            }     
            if (this.isLeftTopBeatingPossible(sourceLocation,isWhiteTurn)){
                let optionalDestinationLocation=sourceLocation.leftTop().leftTop();
                let destinationId=this.getIdByLocation(optionalDestinationLocation);
                if(lastSourceId!=destinationId){
                    let updatedStations=stations.concat(destinationId);
                    console.log(`beat s: ${sourceId}, d:${destinationId}`);
                    this.collectKingBeatingOptions(sourceId,updatedStations,this.getIdByLocation(sourceLocation));
                    return;
                }
            }

            if (stations.length>0){
                console.log('beating options: ',sourceId, stations);
                if (!this.isExtendedPathExists(sourceId,stations)){
                    this.beatingMovesCollection.add(sourceId,stations);
                }
            }
        };

        this.fifthteenMovesCounter =new repeatedKingsMovesInfo(this);

        function sleep(ms) {
            console.log('finished');
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
    }


    function repeatedKingsMovesInfo (board){
        this.amountOfPiecesOnBoard=24;
        this.turnsCounter=0;
        this.isTie=function(sourceId){
            if (board.isKing(sourceId)){
                if(this.amountOfPiecesOnBoard===board.getAmountOfPiecesOnBoard()){
                    if (this.turnsCounter===14){
                        return true;
                    }else{
                        this.turnsCounter++;
                        return false;
                    }
                }else{
                    this.amountOfPiecesOnBoard=board.getAmountOfPiecesOnBoard();
                    this.setCounterValue(1);
                    return false;
                }
            }
            if(!board.isKing(sourceId)){
                this.setCounterValue(0);
                return false;
            }
        }
        this.setCounterValue=function(value){
            this.turnsCounter=value;
        }
    }
    const movesCollection={
        _collection: {},
        
        add(id,optional){
        if (id in this._collection){
            this._collection[id].push(optional);
        }
        else{
            this._collection[id]=[optional];
        }
        },

        getOptionalDestinationsById(id){
            if(id in this._collection){
            return this._collection[id];
            }
            
        },

        clear(){
            this._collection={};  
        },

        get movesCollection(){
        return (this._collection);
        },

        get keys(){
        return Object.keys(this._collection);
        },
        
        get length(){
            return Object.keys(this._collection).length;
        },
        getBeatingPath(sourceId,destinationId){

            let allPaths=this._collection[sourceId];

            for (let path of allPaths){
                if (path[path.length-1] == destinationId){
                    return path;
                }
                    
            }    
            
            
        }

    }
    class OutOfBoardError extends Error{}
    function Location(row,column){
        this.row=row,
        this.column=column,

        this.rightTop=function(){
            if(isLocationOutOfBoard(this.row-1,this.column+1))
                throw new OutOfBoardError("Out Of Board");
            return new Location(this.row-1,this.column+1);
        },

        this.leftTop=function(){
            if(isLocationOutOfBoard(this.row-1,this.column-1))
                throw new OutOfBoardError("Out Of Board");
            return new Location(this.row-1,this.column-1);
        },

        this.rightBottom=function(){
            if(isLocationOutOfBoard(this.row+1,this.column+1))
                throw new OutOfBoardError("Out Of Board");
            return new Location(this.row+1,this.column+1);
        },

        this.leftBottom=function(){
            if(isLocationOutOfBoard(this.row+1,this.column-1))
                throw new OutOfBoardError("Out Of Board");
            return new Location(this.row+1,this.column-1);
        }

        isLocationOutOfBoard=function(row,column){
            if (row>7||row<0||column>7||column<0){
                return true;
            }
            else{
                return false;
            }
            
        }
    }
    

    function resetMove(board){
        isSourceSelected=false;
        board.regularMovesCollection.clear();
        board.beatingMovesCollection.clear();
        board.createPossibleBeatingMovesCollection(isWhiteTurn);
        board.createPossibleRegularMovesCollection(isWhiteTurn);
        gameUI.enableOnlyValidSources(board.getMovesCollection());//new
        gameUI.updateUI(board);//new
    }

    let isWhiteTurn=true;
    let isSourceSelected=false;
    let sourceId,destinationId;
    let isGameOver=false;
    const gameUI=new draughtsUI(boardId);

    async function Move(board) {
        if(gameUI.selected == false) {
        setTimeout(function(){Move(board)}, 100); /* checks if player selected place every 100 milliseconds*/
        } else {
            
            if(!isSourceSelected){
                if (board.isSourceValid(gameUI.selectedPlaceId,isWhiteTurn)){
                    sourceId=gameUI.selectedPlaceId;
                    console.log("Source: ",sourceId);
                    isSourceSelected=true;
                    gameUI.enableOnlyValidDestinations(board.getMovesCollection(),sourceId);
                }
            }
            else{//if destination selected
                destinationId=gameUI.selectedPlaceId;
                console.log("Destination: ",destinationId);
                await board.executeMove(sourceId,destinationId);
                isSourceSelected=false;
                isWhiteTurn=!isWhiteTurn;
                resetMove(board);
                if (board.fifthteenMovesCounter.isTie(destinationId)){
                    isGameOver=true;
                    setTimeout(()=>{alert (`It's a TIE!`)},300);
                    gameUI.cleanSigns(boardId);
                }
                else if(board.isGameOver (board.getMovesCollection(),isWhiteTurn)){
                    gameUI.updateUI(board);
                    isGameOver=true;
                    setTimeout(()=>{alert (`${(isWhiteTurn)?'Black':'White'} is the WINNER!`)},300);
                }
            }
            
            gameUI.selected=false;
            if(!isGameOver){
                
                Move(board);
            }
        }
    }

    this.play=function(){
        let board=new boardInfo();
        
        gameUI.initBoardUI();
        gameUI.updateUI(board);
        
        isWhiteTurn=true;
        isSourceSelected=false;
        sourceId=undefined,destinationId=undefined;
        isGameOver=false;


        board.createPossibleRegularMovesCollection(isWhiteTurn);
        gameUI.enableOnlyValidSources(board.regularMovesCollection);
        
        Move(board);
    }

}





const game=new draughtsGame('game-one',draughtsUI);
game.play();
