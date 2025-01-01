import {addTournDatabaseEntries} from '../fetchTournaments.js'
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';

function generateRandomCron() {
    const seconds = Math.floor(Math.random() * 60); // Random seconds (0-59)
    const minutes = Math.floor(Math.random() * 60); // Random minutes (0-59)
    const hour = Math.floor(Math.random() * 24);    // Random hour (0-23)
    const dayOfWeek = Math.floor(Math.random() * 7); // Random day of the week (0 = Sunday, 6 = Saturday)
    const output = seconds.toString() + " " + minutes.toString() + " " + hour.toString() + " * * " + dayOfWeek.toString()
    return output; // Generate CRON expression for weekly schedule
}

async function updateScheduleInFunctionJson(newScheduleValue) {
    let filePath = resolve("./");
    filePath = filePath + "/addTournEntries/function.json";
  
    try {
        // Read the JSON file
        const fileContent = await readFile(filePath, 'utf-8');

        // Parse the JSON content
        const jsonData = JSON.parse(fileContent);

        // Update the "schedule" key
        if (
            jsonData.bindings &&
            Array.isArray(jsonData.bindings) &&
            jsonData.bindings.length > 0
        ) {
            jsonData.bindings.forEach((binding) => {
                if (binding.schedule !== undefined) {
                    binding.schedule = newScheduleValue;
                }
            });
        } else {
            throw new Error('The "bindings" array is not properly formatted.');
        }
  
        // Write the updated JSON back to the file
        await writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
        console.log('function.json updated successfully.');
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

export default async function (context, myTimer) {
    const timeStamp = new Date().toISOString();

    if (myTimer.isPastDue) {
        context.log('Timer function is running late!');
    }

    context.log('Timer trigger function ran!', timeStamp);

    addTournDatabaseEntries()

    const randomSchedule = generateRandomCron();
    updateScheduleInFunctionJson(randomSchedule)
}