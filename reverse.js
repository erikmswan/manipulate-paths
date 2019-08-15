const { reverse } = require('smart-svg-path');
const fs = require('fs');

const path = reverse('M 5640 350 L 5779 375 L 5805 391 L 5813 389 L 5891 397 C 5891 397 5890 436 5884 449 C 5878 462 5829 461 5823 460 L 5724 443 L 5694 604 L 5674 716 L 5589 680 L 5605 588 L 5592 586 L 5623 466 L 5623 445 L 5647 352 L 4890 238 L 4884 280 L 4821 272 L 4799 266 L 4760 324 L 4717 351 L 4604 403 L 4562 453 L 4544 493 L 4464 458 L 4492 704 L 4405 715 L 4503 938 L 4620 888 L 4817 864 L 4841 1057 L 4843 1070 L 4865 1128 L 4787 1154 L 4804 1291 L 4794 1301 L 4379 1350 L 4261 1252 L 4114 1433 L 3915 1267 L 3588 1477 L 3301 1370 L 3306 1361 L 3368 1199 L 3378 1182 L 3487 984 L 2998 713 L 2981 740 L 2737 605 L 2719 561 L 2616 333 L 2518 448 L 2505 447 L 2486 446 L 2412 817 L 2399 917 L 2583 940');

fs.writeFile(
  'reverse-output.json',
  path,
  err => {
    if (err) console.log(err);
    console.log('DONE!');
  }
);
