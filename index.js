var  API_KEY = "8040a1d3";
//module.exports = API_KEY;

var  express = require('express');
var  bodyParser = require('body-parser');
var  http = require('http');
//const API_KEY = require('./apiKey');

var  server = express();
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use(bodyParser.json());


server.post('/get-movie-details', (req, res) => {

    var   movieToSearch = req.body.result && req.body.result.parameters && req.body.result.parameters.movie ? req.body.result.parameters.movie : 'The Godfather';
    var  reqUrl = encodeURI(`http://www.omdbapi.com/?t=${movieToSearch}&apikey=${API_KEY}`);
    http.get(reqUrl, (responseFromAPI) => {
        var  completeResponse = '';
        responseFromAPI.on('data', (chunk) => {
            completeResponse += chunk;
        });
        responseFromAPI.on('end', () => {
            var   movie = JSON.parse(completeResponse);
		console.log(movie)
		console.log( movie.Title +" and "+ movie.imdbRating +" and "+ movie.Genre+ " and "+movie.Year)
		var retData="";
		if(movie.Response=="True" ){
			retData+=movie.Title+"is a";
			if(movie.Actors!="N/A"){
				retData+=movie.Actors+ " starer";
			}
			if(movie.Genre!="N/A"){
				retData+=movie.Genre+ " movie";
			}
			else{retData+=' movie '}
					
			if(movie.Year!="N/A"){
				retData+="released in " +movie.Year;
			}
			if(movie.Director!="N/A"){	      
				retData+="It was directed by" +movie.Director;
			}
			if(movie.imdbRating!="N/A"){		
				retData+="It has" +movie.imdbRating+" Imdb rating"; 
			}
			if(movie.imdbVotes!="N/A"){
				retData+="with" +movie.imdbVotes+" Imdb votes."  
			}
			retData+="\r\n \r\n If you need information about another movie, you can ask me."
		}
		else
		{
			retData='Movie Not Found! try another one'
		}
		
		let dataToSend ="";
		
		
		if(movie.Response=="True" ){
				dataToSend += `${movie.Title} is a ${movie.Actors} starer ${movie.Genre} movie, released in ${movie.Year}. It was directed by ${movie.Director}. It has ${movie.imdbRating} Imdb rating with ${movie.imdbVotes} Imdb votes.  \r\n \r\n If you need information about another movie, you can ask me. `;

		}
		else{
			dataToSend='Movie Not Found! try another one'
		}
         //  let dataToSend = movieToSearch === 'The Godfather' ? `I don't have the required info on that. Here's some info on 'The Godfather' instead.\n` : '';
          
	//dataToSend += `${movie.Title} is a ${movie.Actors} starer ${movie.Genre} movie, released in ${movie.Year}. It was directed by ${movie.Director}. It has ${movie.imdbRating} Imdb rating with ${movie.imdbVotes} Imdb votes.  \r\n \r\n If you need information about another movie, you can ask me. `;
            return res.json({
                speech: retData,
                displayText: retData,
                source: 'get-movie-details'
            });
        });
    }, (error) => {
        return res.json({
            speech: 'Something went wrong!',
            displayText: 'Something went wrong!',
            source: 'get-movie-details'
        });
    });
});

server.listen((process.env.PORT || 8000), () => {
    console.log("Server is up and running...");
});
