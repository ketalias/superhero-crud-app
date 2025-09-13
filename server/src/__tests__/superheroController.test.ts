import {
  getAllSuperheroes,
  getSuperheroById,
  createSuperhero,
  updateSuperhero,
  deleteSuperhero,
  deleteHeroImage,
} from "../../src/controllers/superheroController";

import { Superhero } from "../../src/models/Superhero";
import { cloudinary } from "../../src/config/cloudinary";

jest.mock("../../src/models/Superhero");
jest.mock("../../src/config/cloudinary", () => ({
  cloudinary: {
    uploader: { destroy: jest.fn() },
  },
}));

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("superheroController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllSuperheroes", () => {
    it("повертає список героїв з пагінацією", async () => {
      const req: any = { query: { page: "1" } };
      const res = mockResponse();

      (Superhero.countDocuments as jest.Mock).mockResolvedValue(2);
      (Superhero.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          { _id: "1", nickname: "Batman", images: [{ url: "bat.jpg" }] },
          { _id: "2", nickname: "Superman", images: [] },
        ]),
      });

      await getAllSuperheroes(req, res);

      expect(res.json).toHaveBeenCalledWith({
        page: 1,
        totalPages: 1,
        superheroes: [
          { id: "1", nickname: "Batman", image: { url: "bat.jpg" } },
          { id: "2", nickname: "Superman", image: null },
        ],
      });
    });
  });

  describe("getSuperheroById", () => {
    it("повертає героя якщо він існує", async () => {
      const req: any = { params: { id: "1" } };
      const res = mockResponse();

      (Superhero.findById as jest.Mock).mockResolvedValue({ _id: "1", nickname: "Flash" });

      await getSuperheroById(req, res);

      expect(res.json).toHaveBeenCalledWith({ _id: "1", nickname: "Flash" });
    });

    it("повертає 404 якщо не знайдено", async () => {
      const req: any = { params: { id: "1" } };
      const res = mockResponse();

      (Superhero.findById as jest.Mock).mockResolvedValue(null);

      await getSuperheroById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("createSuperhero", () => {
    it("створює героя з картинками", async () => {
      const req: any = {
        body: { nickname: "IronMan" },
        files: [{ path: "img1.jpg", filename: "id1" }],
      };
      const res = mockResponse();

      (Superhero as any).mockImplementation((data: any) => ({
        ...data,
        save: jest.fn().mockResolvedValue(data),
      }));

      await createSuperhero(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nickname: "IronMan",
          images: [{ url: "img1.jpg", public_id: "id1" }],
        })
      );
    });
  });

  // ---------------- UPDATE ----------------
  describe("updateSuperhero", () => {
    it("оновлює героя та додає нові картинки", async () => {
      const req: any = {
        params: { id: "1" },
        body: { nickname: "UpdatedMan" },
        files: [{ path: "img2.jpg", filename: "id2" }],
      };
      const res = mockResponse();

      const heroMock = {
        _id: "1",
        nickname: "OldMan",
        images: [],
        save: jest.fn().mockResolvedValue(true),
      };

      (Superhero.findById as jest.Mock).mockResolvedValue(heroMock);

      await updateSuperhero(req, res);

      expect(heroMock.images).toEqual([{ url: "img2.jpg", public_id: "id2" }]);
      expect(heroMock.nickname).toBe("UpdatedMan");
      expect(res.json).toHaveBeenCalledWith(heroMock);
    });

    it("повертає 404 якщо героя нема", async () => {
      const req: any = { params: { id: "1" } };
      const res = mockResponse();

      (Superhero.findById as jest.Mock).mockResolvedValue(null);

      await updateSuperhero(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // ---------------- DELETE HERO ----------------
  describe("deleteSuperhero", () => {
    it("видаляє героя та його картинки", async () => {
      const req: any = { params: { id: "1" } };
      const res = mockResponse();

      const heroMock = {
        images: [{ public_id: "img1" }],
        deleteOne: jest.fn().mockResolvedValue(true),
      };

      (Superhero.findById as jest.Mock).mockResolvedValue(heroMock);

      await deleteSuperhero(req, res);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("img1");
      expect(heroMock.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: "Hero and images deleted" });
    });
  });

  describe("deleteHeroImage", () => {
    it("видаляє одну картинку героя", async () => {
      const req: any = { params: { id: "1", publicId: "img1" } };
      const res = mockResponse();

      const heroMock = {
        images: [{ public_id: "img1" }, { public_id: "img2" }],
        save: jest.fn().mockResolvedValue(true),
      };

      (Superhero.findById as jest.Mock).mockResolvedValue(heroMock);

      await deleteHeroImage(req, res);

      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith("img1");
      expect(heroMock.images).toEqual([{ public_id: "img2" }]);
      expect(res.json).toHaveBeenCalledWith(heroMock);
    });
  });
});
