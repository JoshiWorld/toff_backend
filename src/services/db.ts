import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Create Master
async function createMaster(
  master: { role: string; password: string }
) {
  try {
    const { role, password } = master;

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create master record using Prisma
    const createdMaster = await prisma.master.create({
      data: {
        role: role,
        password: hashedPassword,
      },
    });

    return createdMaster;
  } catch (error) {
    console.error("Error creating master:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

// Get Master
async function getMaster(
  role: string,
  password: string
) {
  try {
    // Find master record with role
    const master = await prisma.master.findUnique({
      where: {
        role: role,
      },
    });

    if (!master) {
      return;
    }

    // Compare passwords
    bcrypt.compare(password, master.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return err;
      }

      if (!isMatch) {
        return;
      }

      return master;
    });
  } catch (error) {
    console.error("Error retrieving master:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function getLiveBlogs() {
  try {
    // Find all liveblogs
    const liveblogs = await prisma.live.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        ticketLink: true,
        imageSource: true,
        archived: true,
        isVideo: true,
        mediaSource: true,
      },
    });

    return liveblogs;
  } catch (error) {
    console.error("Error retrieving liveblogs:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function getLiveBlogById(
  id: string,
) {
  try {
    // Find liveblog by id
    const liveblog = await prisma.live.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        ticketLink: true,
        imageSource: true,
        archived: true,
        isVideo: true,
        mediaSource: true,
      },
    });

    return liveblog;
  } catch (error) {
    console.error("Error retrieving liveblog:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function createLiveBlog(
  liveblog: {
    title: string;
    description: string;
    ticketLink: string | null;
    imageSource: string | null;
    isVideo: boolean;
    mediaSource: string | null;
  }
) {
  try {
    // Create a new liveblog entry
    const createdLiveblog = await prisma.live.create({
      data: {
        title: liveblog.title,
        description: liveblog.description,
        ticketLink: liveblog.ticketLink,
        imageSource: liveblog.imageSource,
        isVideo: liveblog.isVideo,
        mediaSource: liveblog.mediaSource,
      },
    });

    console.log("Live entry inserted successfully");
    return createdLiveblog;
  } catch (error) {
    console.error("Error inserting live entry:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function updateLiveBlog(
  id: string,
  updatedData: {
    title?: string;
    description?: string;
    ticketLink?: string | null;
    imageSource?: string | null;
    isVideo?: boolean;
    mediaSource?: string | null;
  }
) {
  try {
    // Update the liveblog entry based on the id
    const updatedLiveblog = await prisma.live.update({
      where: { id: id },
      data: updatedData,
    });

    console.log("Live entry updated successfully");
    return updateLiveBlog;
  } catch (error) {
    console.error("Error updating live entry:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function deleteLiveBlog(
  id: string,
) {
  try {
    // Delete the liveblog entry based on the id
    const deletedLiveblog = await prisma.live.delete({
      where: { id: id },
    });

    console.log("Live entry deleted successfully");
    return deletedLiveblog;
  } catch (error) {
    console.error("Error deleting live entry:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function getLiveBlogsPaginated(
  itemsPerPage: number,
  page: number,
) {
  try {
    const offset = (page - 1) * itemsPerPage;

    // Fetch liveblogs with pagination
    const liveblogs = await prisma.live.findMany({
      skip: offset,
      take: itemsPerPage,
      orderBy: {
        id: "desc", // Order by id descending
      },
    });

    return liveblogs;
  } catch (error) {
    console.error("Error fetching liveblogs:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function getStats() {
  try {
    // Fetch stats from the database
    const stats = await prisma.stats.findMany();

    return stats;
  } catch (error) {
    console.error("Error fetching stats:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function createStats(
  stat: { title: string; value: number; goal: number; color: string }
) {
  try {
    // Insert stats into the database
    const results = await prisma.stats.create({
      data: {
        title: stat.title,
        value: stat.value,
        goal: stat.goal,
        color: stat.color,
      },
    });

    console.log("Stats entry inserted successfully");
    return results;
  } catch (error) {
    console.error("Error inserting stats entry:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function updateStats(
  id: string,
  updatedData: {
    title?: string;
    value?: number;
    goal?: number;
    color?: string;
  }
) {
  try {
    // Update stats in the database
    const results = await prisma.stats.update({
      where: { id: id },
      data: updatedData,
    });

    console.log("Stats entry updated successfully");
    return results;
  } catch (error) {
    console.error("Error updating stats entry:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

async function deleteStats(
  id: string
) {
  try {
    // Delete stats entry from the database
    const results = await prisma.stats.delete({
      where: { id: id },
    });

    console.log("Stats entry deleted successfully");
    return results;
  } catch (error) {
    console.error("Error deleting stats entry:", error);
    return error;
  } finally {
    await prisma.$disconnect(); // Disconnect from the database
  }
}

export {
  createMaster,
  getMaster,
  getLiveBlogs,
  getLiveBlogById,
  createLiveBlog,
  updateLiveBlog,
  deleteLiveBlog,
  getLiveBlogsPaginated,
  getStats,
  createStats,
  updateStats,
  deleteStats
};