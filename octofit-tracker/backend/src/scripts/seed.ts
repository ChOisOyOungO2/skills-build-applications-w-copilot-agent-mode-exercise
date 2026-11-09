import mongoose from 'mongoose';
import { Activity, Leaderboard, Team, User, Workout } from '../models.js';

const connectionString = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    const now = new Date();
    const dayStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const weekStart = new Date(dayStart);
    weekStart.setUTCDate(weekStart.getUTCDate() - ((weekStart.getUTCDay() + 6) % 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);

    const teams = await Promise.all([
      Team.findOneAndUpdate(
        { name: 'Summit Striders' },
        { $set: { description: 'Trail runners building endurance together.' } },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
      Team.findOneAndUpdate(
        { name: 'Harbor Cyclists' },
        { $set: { description: 'A friendly team for rides around the harbor.' } },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
    ]);

    const [maya, leo, priya] = await Promise.all([
      User.findOneAndUpdate(
        { email: 'maya.chen@example.com' },
        {
          $set: {
            username: 'mayaruns',
            name: 'Maya Chen',
            team: teams[0]._id,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
      User.findOneAndUpdate(
        { email: 'leo.martin@example.com' },
        {
          $set: {
            username: 'leopedals',
            name: 'Leo Martin',
            team: teams[1]._id,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
      User.findOneAndUpdate(
        { email: 'priya.shah@example.com' },
        {
          $set: {
            username: 'priyamoves',
            name: 'Priya Shah',
            team: teams[0]._id,
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
    ]);

    await Promise.all([
      Team.updateOne({ _id: teams[0]._id }, { $set: { members: [maya._id, priya._id] } }),
      Team.updateOne({ _id: teams[1]._id }, { $set: { members: [leo._id] } }),
    ]);

    const activities = [
      {
        user: maya,
        type: 'Trail run',
        durationMinutes: 42,
        distanceKm: 6.4,
        caloriesBurned: 390,
        daysAgo: 0,
      },
      {
        user: maya,
        type: 'Yoga',
        durationMinutes: 30,
        distanceKm: 0,
        caloriesBurned: 120,
        daysAgo: 2,
      },
      {
        user: leo,
        type: 'Cycling',
        durationMinutes: 55,
        distanceKm: 21.8,
        caloriesBurned: 510,
        daysAgo: 0,
      },
      {
        user: leo,
        type: 'Strength training',
        durationMinutes: 35,
        distanceKm: 0,
        caloriesBurned: 240,
        daysAgo: 3,
      },
      {
        user: priya,
        type: 'Run',
        durationMinutes: 28,
        distanceKm: 4.1,
        caloriesBurned: 275,
        daysAgo: 1,
      },
      {
        user: priya,
        type: 'Walk',
        durationMinutes: 45,
        distanceKm: 3.2,
        caloriesBurned: 165,
        daysAgo: 4,
      },
    ];

    await Promise.all(
      activities.map(({ user, daysAgo, ...activity }) => {
        const date = new Date(dayStart);
        date.setUTCDate(date.getUTCDate() - daysAgo);
        return Activity.findOneAndUpdate(
          { user: user._id, type: activity.type, date },
          { $set: { ...activity, date } },
          { upsert: true, returnDocument: 'after', runValidators: true },
        );
      }),
    );

    await Promise.all(
      [
        { user: maya, team: teams[0], points: 860 },
        { user: leo, team: teams[1], points: 740 },
        { user: priya, team: teams[0], points: 690 },
      ].map(({ user, team, points }) =>
        Leaderboard.findOneAndUpdate(
          { user: user._id, periodStart: weekStart, periodEnd: weekEnd },
          { $set: { team: team._id, points } },
          { upsert: true, returnDocument: 'after', runValidators: true },
        ),
      ),
    );

    const workouts = [
      {
        name: 'Beginner Trail Run',
        description: 'An easy-paced outdoor run with a short warm-up and cool-down.',
        category: 'Cardio',
        durationMinutes: 30,
        difficulty: 'Beginner',
      },
      {
        name: 'Full Body Strength',
        description: 'A balanced bodyweight routine for major muscle groups.',
        category: 'Strength',
        durationMinutes: 35,
        difficulty: 'Intermediate',
      },
      {
        name: 'Recovery Flow',
        description: 'Gentle mobility and stretching to support recovery.',
        category: 'Flexibility',
        durationMinutes: 25,
        difficulty: 'Beginner',
      },
      {
        name: 'Harbor Endurance Ride',
        description: 'A steady cycling session focused on aerobic endurance.',
        category: 'Cycling',
        durationMinutes: 50,
        difficulty: 'Intermediate',
      },
    ];

    await Promise.all(
      workouts.map(({ name, ...workout }) =>
        Workout.findOneAndUpdate(
          { name },
          { $set: workout },
          { upsert: true, returnDocument: 'after', runValidators: true },
        ),
      ),
    );

    console.log(
      'Database seeding complete: users, teams, activities, leaderboard, and workouts are ready.',
    );
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
