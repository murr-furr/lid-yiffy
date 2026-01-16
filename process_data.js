import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { translate } from 'google-translate-api-x';

const inputFile = 'questions_utf8.csv';
const outputFile = 'app/data/furry_questions.json';

const furryDictionary = {
  'Menschen': 'Furries',
  'Mensch': 'Furry',
  'Leute': 'Furs',
  'Person': 'Fur',
  'Kind': 'Pup',
  'Kinder': 'Pups',
  'Eltern': 'Sires and Dams',
  'Frau': 'Vixen',
  'Mann': 'Tod',
  'Deutschland': 'Furland',
  'Regierung': 'Alpha Pack',
  'Präsident': 'Pack Leader',
  'Kanzler': 'Prime Howler',
  'Bundestag': 'Grand Council of Paws',
  'Partei': 'Pack',
  'Wahl': 'Selection',
  'Gesetz': 'Law of the Jungle',
  'Verfassung': 'Grand Code',
  'Recht': 'Right',
  'Pflicht': 'Duty',
  'Arbeit': 'Hunt',
  'Geld': 'Treats',
  'Steuern': 'Tribute',
  'Schule': 'Training Den',
  'Polizei': 'Paw Patrol',
  'Gericht': 'Council of Elders',
  'Demokratie': 'Democrawcy',
};

const uwuifiers = [
  ' uwu',
  ' owo',
  ' >w<',
  ' ^w^',
  ' :3',
  ' rawr!',
  ' *wags tail*',
  ' *notices your laws*',
  ' *ears perk up*',
];

function furryfy(text) {
  let processed = text;

  // Apply specific replacements
  for (const [key, value] of Object.entries(furryDictionary)) {
     const regex = new RegExp(key, 'gi');
     processed = processed.replace(regex, value);
  }

  // Random uwuification at the end
  if (Math.random() > 0.3) {
    processed += uwuifiers[Math.floor(Math.random() * uwuifiers.length)];
  }

  return processed;
}

async function processQuestions() {
  const input = fs.readFileSync(inputFile);
  const records = parse(input, {
    columns: true,
    delimiter: ';',
    skip_empty_lines: true
  });

  const outputQuestions = [];
  const total = records.length;
  console.log(`Processing ${total} questions...`);

  // Process in small batches to save state incrementally
  const BATCH_SIZE = 10;
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(async (record) => {
      const qObj = {
        id: record.num,
        original_question: record.question,
        question: '',
        options: {
            a: '',
            b: '',
            c: '',
            d: ''
        },
        answer: record.solution,
        image: record.image !== '-' ? record.image : null,
        category: record.area
      };

      try {
        // Construct the object
        // Use translation for English requirement
        const combinedText = `${record.question} ||| ${record.a} ||| ${record.b} ||| ${record.c} ||| ${record.d}`;
        const res = await translate(combinedText, { to: 'en' });
        const parts = res.text.split('|||').map(s => s.trim());

        if (parts.length === 5) {
            qObj.question = furryfy(parts[0]);
            qObj.options.a = furryfy(parts[1]);
            qObj.options.b = furryfy(parts[2]);
            qObj.options.c = furryfy(parts[3]);
            qObj.options.d = furryfy(parts[4]);
        } else {
             // Fallback individual translation
            qObj.question = furryfy(await translate(record.question, {to: 'en'}).then(r => r.text));
            qObj.options.a = furryfy(await translate(record.a, {to: 'en'}).then(r => r.text));
            qObj.options.b = furryfy(await translate(record.b, {to: 'en'}).then(r => r.text));
            qObj.options.c = furryfy(await translate(record.c, {to: 'en'}).then(r => r.text));
            qObj.options.d = furryfy(await translate(record.d, {to: 'en'}).then(r => r.text));
        }

      } catch (e) {
        console.error(`Error processing #${record.num}:`, e.message);
        // Fallback: Furryfy German
        qObj.question = furryfy(record.question);
        qObj.options.a = furryfy(record.a);
        qObj.options.b = furryfy(record.b);
        qObj.options.c = furryfy(record.c);
        qObj.options.d = furryfy(record.d);
      }
      outputQuestions.push(qObj);
    }));

    // Save progress periodically
    fs.writeFileSync(outputFile, JSON.stringify(outputQuestions, null, 2));
    console.log(`Processed ${Math.min(i + BATCH_SIZE, total)}/${total}`);

    // Slight delay to be nice to API
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('Done!');
}

processQuestions();
