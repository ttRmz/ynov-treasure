require('dotenv').config();
var chasseController = require('../controllers/chasse.js');
var chasseSchema = require('../models/chasse.js');
var mongoose = require('mongoose');
var express = require('express');

var router = express.Router();


mongoose.connect(process.env.MLAB_LINK);

module.exports = function (io) {
    io.on('connection', function (socket) {

      socket.on('WTJ', (pseudo) => {
        console.log(pseudo)
        var p = {playername: pseudo};
        chasseController.findChasse().then( data => {
          console.log(data);
          chasseSchema.find({playersin: {$elemMatch: p}}).exec( (err, found) => {
            if(err){
              socket.emit('Error', err);
            }
            if(found.length == 0){
              chasseController.joinChasse(data[0], p).then( azza => {
                if (azza){
                  socket.emit('Joined');
                }else{
                  socket.emit('Error', "Une erreur est survenue, la chasse est-elle compléte ?");
                }
              })
            }else{
              socket.emit('Error', "Vous participer déjà a cette chasse");
            }
          })
        })
      })


      socket.on('Success', tab => {
        chasseController.updateStep(tab[0], tab[1], tab[2]).then( bool => {
          if(bool){
            socket.emit('TrueSucess');
          }
        })
      })
    });
  };