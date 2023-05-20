module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert('court', [
      {
        name: 'Basketball',
        image_url: 'https://upload-images-task.s3.amazonaws.com/basketball',
        description: JSON.stringify({ length: '13.4m', width: '6.1m', net: '1.5m', floor: 'wooden' }),
        count: 2,
        capacity: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Badminton',
        image_url: 'https://upload-images-task.s3.amazonaws.com/badminton',
        description: JSON.stringify({ length: '13.4m', width: '6.1m', net: '1.5m', floor: 'wooden' }),
        count: 4,
        capacity: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Skating',
        image_url: 'https://upload-images-task.s3.amazonaws.com/skating',
        description: JSON.stringify({ length: '13.4m', width: '6.1m', net: '1.5m', floor: 'wooden' }),
        count: 1,
        capacity: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Squash',
        image_url: 'https://upload-images-task.s3.amazonaws.com/squash',
        description: JSON.stringify({ length: '13.4m', width: '6.1m', net: '1.5m', floor: 'wooden' }),
        count: 2,
        capacity: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Table Tennis',
        image_url: 'https://upload-images-task.s3.amazonaws.com/table-tennis',
        description: JSON.stringify({ length: '13.4m', width: '6.1m', net: '1.5m', floor: 'wooden' }),
        count: 4,
        capacity: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Swimming Pool',
        image_url: 'https://upload-images-task.s3.amazonaws.com/swimming-pool',
        description: JSON.stringify({ length: '13.4m', width: '6.1m', net: '1.5m', floor: 'wooden' }),
        count: 2,
        capacity: 5,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },
  down: queryInterface => {
    return queryInterface.bulkDelete('court', null, {});
  }
};
