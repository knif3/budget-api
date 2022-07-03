import { Stats } from 'fs';
import Hound from './hound';

const listen = (): void => {

  //   const watcher = Hound.watch('/app/var/dummy');
  //   watcher.on('create', function (file: string, stats: Stats) {
  //     const datetime = Date.now();
  //     console.log(`${datetime} create: ${file}`);
  // //  console.log(stats);
  //   });
  //   watcher.on('change', function (file: string, stats: Stats) {
  //     const datetime = Date.now();
  //     console.log(`${datetime} change: ${file}`);
  // //  console.log(stats);
  //   });
  //   watcher.on('delete', function (file: string) {
  //     const datetime = Date.now();
  //     console.log(`${datetime} delete: ${file}`);
  //   });

  // watcher.clear();

};

export default {
  listen,
};
