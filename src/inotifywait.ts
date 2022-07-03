import fs from 'fs';

const listen = (): void => {
  console.log(__dirname);
  const fsOptions = {
    recursive: true,
  };

  fs.watch('/app/var/dummy', fsOptions, (eventType: string, filename: string) => {
    if (filename.substr(0, 1) === '.') {
      return;
    }

    const datetime = Date.now();
    console.log(`${datetime} ${eventType}: ${filename}`);
  });

  // let watch1 = new INotifyWait('.', {recursive: false});
  // watch1.on('ready', (filename: string) => {
  // console.log('watcher is watching');
  // });
};

export default {
  listen,
};
