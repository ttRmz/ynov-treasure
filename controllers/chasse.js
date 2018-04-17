var chasseSchema = require('../models/chasse.js');
require('dotenv').config();
var mongoose = require('mongoose');
var result = [];
mongoose.connect(process.env.MLAB_LINK);

module.exports = {
    showChasse: () => {
        return new Promise((resolve, reject)=>{
            chasseSchema.find({}, (err, res) => {
                if(err){
                    return reject(err);
                }
        
                if(res){
                    return resolve(res);
                }
            })
        })
    },

    findChasseByUsername: (pseudo) => {
        return new Promise((resolve, reject) => {
            chasseSchema.find({playersin: {$elemMatch: pseudo}}).exec( (err, found) => {
                if(err){
                    resolve(err);
                }
                if(found){
                    resolve(found);
                }else{
                    resolve("error");
                }
            })
        })
    },
    checkChasse: (pseudo) =>{
        return new Promise((resolve, reject) => {
            chasseSchema.find({playersin: {$elemMatch: pseudo}}).exec( (err, found) => {
                if(err){
                    resolve(err);
                }
                if(found.length == 0){
                    resolve(true);
                }else{
                    resolve(false);
                }
            })
        })
    },    
    findChasse: () => {
        return new Promise((resolve, reject) => {
            chasseSchema.find({countplayer: {$lt : 20}}).limit(1).exec( (err, chasse) => {
                if(err){
                    return reject(err);
                }
    
                if(chasse){
                    return resolve(chasse);
                }
            })
        })
    },
    
    joinChasse: (data, playername) => {
        return new Promise((resolve, reject) => {
            if(data){
                chasseSchema.findOneAndUpdate({ name: data.name }, { $inc:{countplayer: 1}, $push:{playersin: playername}}).exec();
                return resolve(true);
            }else{
                return resolve("Error");
            }
        
        })
    },

    checkStep: (cn, pn) => {{
        return new Promise((resolve, reject) => {
            chasseSchema.find({name: cn}).exec( (err, chasse) => {
                if(err){
                    return reject(err);
                }
    
                if(chasse){
                    for(var i=0; i < chasse[0].enigme.length; i++){
                        
                        if(chasse[0].enigme[i].playercleared.length > 0){
                            for(var k = 0; k < chasse[0].enigme[i].playercleared.length; k++){
                                if(!chasse[0].enigme[i].playercleared[k].playername.includes(pn)){
                                    result.push(chasse[0].enigme[i]);
                                }else{
                                    result = [];                                
                                }
                            }
                        }
                    }
                    console.log(result);
                    return resolve(result);
                }else{
                    resolve("None");
                }
            })
        })
    }},
    updateStep: (cn, pn, step) => {
        return new Promise((resolve, reject) => {
            if(step == 1){
                chasseSchema.findOneAndUpdate({name : cn}, {$push: { "enigme.0.playercleared": {playername : pn}}}, (err, up) => {
                    if(err){
                        console.log("error : " + err);
                    }else{
                        return resolve(true);
                    }
                })
            }else if(step == 2){
                chasseSchema.findOneAndUpdate({name : cn}, {$push: { "enigme.1.playercleared": {playername : pn}}}, (err, up) => {
                    if(err){
                        console.log("error : " + err);
                    }else{
                        return resolve(true);
                    }
                })
            }else if(step == 3){
                chasseSchema.findOneAndUpdate({name : cn}, {$push: { "enigme.2.playercleared": {playername : pn}}}, (err, up) => {
                    if(err){
                        console.log("error : " + err);
                    }else{
                        return resolve(true);
                    }
                })
            }
        })
    }
}