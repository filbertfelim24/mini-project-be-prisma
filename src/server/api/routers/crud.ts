import { Prisma } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { triggerAsyncId } from "async_hooks";
import { now } from "next-auth/client/_utils";

export const crudRouter = createTRPCRouter({
  getStudentsWithCoursesOnId: publicProcedure
    .input(z.object({ studentId: z.string().uuid().optional() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
      const student = await ctx.prisma.student.findMany({
        where: {
          id: input.studentId
        },
        select: {
          id: true,
          first_name: true,
          last_name: true
        }
      });
      return student;
      // Expected output: data student berdasarkan id yang diberikan, kalau id tidak diberikan, fetch semua data
    }),

  getAllCourses: publicProcedure.query(async ({ ctx }) => {
    // TODO: isi logic disini
    return await ctx.prisma.course.findMany({
      select: {
        id: true,
        name: true,
        credits: true
      }
    });
    // Expected output: seluruh data course yang ada
  }),

  getStudentsListOnCourseId: publicProcedure
    .input(z.object({ courseId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // TODO: isi logic disini
      const course = await ctx.prisma.course.findFirst({
        where: {
          id: input.courseId
        },
        select: {
          id: true,
          name: true,
          credits: true
        }
      });
      const student = await ctx.prisma.enrollment.findMany({
        where: {
          course_id: input.courseId
        },
        select: {
          student: {
            select: {
              id: true,
              first_name: true,
              last_name: true
            }
          }
        }
      });
      return [course, student];
      // Expected output: data course berdasarkan id yang diberikan beserta seluruh student yang mengikutinya
    }),

  insertNewStudent: publicProcedure
    .input(z.object({ first_name: z.string(), last_name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      return await ctx.prisma.student.create({
        data: {
          first_name: input.first_name,
          last_name: input.last_name
        }
      });
    }),

  insertNewCourse: publicProcedure
    .input(z.object({ name: z.string(), credits: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      return await ctx.prisma.course.create({
        data: {
          name: input.name,
          credits: input.credits
        }
      });
      // Expected output: hasil data yang di insert
    }),

  enrollNewStudent: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      return await ctx.prisma.enrollment.create({
        data: {
          enrollment_date: new Date(),
          student_id: input.studentId,
          course_id: input.courseId
        }
      });
      // Expected output: hasil data yang di insert, enrollment_date mengikuti waktu ketika fungsi dijalankan
    }),

  updateCourseData: publicProcedure
    .input(
      z.object({
        courseId: z.string().uuid(),
        name: z.string().optional(),
        credits: z.number().optional()
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      return await ctx.prisma.course.update({
        where: {
          id: input.courseId
        },
        data: {
          name: input.name,
          credits: input.credits
        }
      });
      // Expected output: hasil data yang di update berdasarkan courseId yang diberikan, apabila name atau credits tidak diberikan, tidak usah di update
    }),

  removeStudentfromCourse: publicProcedure
    .input(
      z.object({ studentId: z.string().uuid(), courseId: z.string().uuid() })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO: isi logic disini
      const data = await ctx.prisma.enrollment.deleteMany({
        where: {
          student_id: input.studentId,
          course_id: input.courseId
        }
      });
      // Expected output: hasil data yang di delete
    })
});
