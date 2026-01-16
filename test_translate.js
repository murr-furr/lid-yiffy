import { translate } from 'google-translate-api-x';

async function test() {
  try {
    const res = await translate('In Deutschland dürfen Menschen offen etwas gegen die Regierung sagen, weil ...', { to: 'en' });
    console.log(res.text);
  } catch (e) {
    console.error(e);
  }
}

test();
