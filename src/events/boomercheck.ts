import { Events } from 'discord.js';
import fs from 'fs';

module.exports = {

	name: Events.ClientReady,
	once: true,
	execute(client) {
		
        fs.access('../db/boomerlist.json', fs.constants.F_OK, (err) => {

            if (err) {
                console.error('Boomerlist does not exist. Creating a boomer list file.');

                fs.writeFile('../db/boomerlist.json', JSON.stringify({"users":[]}), (err) => {

                    if (err) {

                        console.error(err)
                    }
                })

                console.log('Created file boomerlist.json in /db');

            } 
            else {

            console.log('Boomer list exists in ../db')
            }
        })
	},
};