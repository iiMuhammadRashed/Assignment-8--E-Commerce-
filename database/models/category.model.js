import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: [2, 'too short category name'],
      lowercase: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: Object,
      required: [true, 'category image is required'],
    },
  },
  {
    timestamps: true,
  }
);

// categorySchema.post('init', function (doc) {
//   doc.image = process.env.BASE_URL + 'category/' + doc.image;
// });

export const categoryModel = model('category', categorySchema);
