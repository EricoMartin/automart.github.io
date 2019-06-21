import cloudinary from 'cloudinary';
import log from 'fancy-log';
import model from '../models/model/model';

/*
  * @description - creates a new car
   * @params {object}
   * @returns {object}
   */

cloudinary.v2.config({
    cloud_name: process.env.ClOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const { Cars } = model;

class CarAds {
  static async createAd(req, res) {
    try{
    // Request body
      let {manufacturer, model, price, state, year, bodyType,
      } = req.body;

      // Format Inputs
      const { id, email } = req.authData.user;
      const owner = id;
      manufacturer = manufacturer.trim().replace(/\s+/g, '');
      model = model.trim().replace(/\s+/g, '');
      price = parseFloat(price);
      state = state.trim().replace(/\s+/g, '');
      year = parseInt(year, 10);
      bodyType = bodyType.trim().replace(/\s+/g, '');

      // Create a promise
      const multipleUpload = new Promise((resolve, reject) => {
        const imageUrl = [];
        if (req.files.image.length > 1) {
          req.files.image.forEach((x) => {
            cloudinary.v2.uploader.upload(x.path, (error, result) => {
              if (result) imageUrl.push(result.url);
              if (imageUrl.length === req.files.image.length) {
                resolve(imageUrl);
              } else if (error) {
                log.warn(error);
                reject(error);
              }
            });
          });
        }
      })
        .then(result => result)
        .catch(error => error);

      // Wait for promise to be resolved
      const imgUrl = await multipleUpload;
      if (imgUrl.code || imgUrl.errno) {
        return res.status(500).json({
          status: 500,
          error: imgUrl,
        });
      }

    // Create Data
    const adsData = Cars.createCarAd({
      owner,
      email,
      manufacturer,
      model,
      price,
      state,
      year,
      bodyType,
      imgUrl,
    });

    return res.status(201).json({
      status: 201,
      data: {
        id: adsData.id,
        owner: adsData.owner,
        email: adsData.email,
        created_on: adsData.createdOn,
        manufacturer: adsData.manufacturer,
        model: adsData.model,
        price: adsData.price,
        state: adsData.state,
        status: adsData.status,
        year: adsData.year,
        body_type: adsData.bodyType,
        images: adsData.imgUrl,
      },
    });
  } catch (error) {
      res.status(error.statusCode || 500).json(error.message);
    }
  }

  static updateStatus(req, res) {
    try{
    const id = parseInt(req.params.id, 10);
    const updatedAd = Cars.updateStatus(id, req.body.status.trim());

    return res.status(200).json({
      status: 200,
      data: {
        id: updatedAd.id,
        email: updatedAd.email,
        created_on: updatedAd.createdOn,
        manufacturer: updatedAd.manufacturer,
        model: updatedAd.model,
        price: updatedAd.price,
        state: updatedAd.state,
        status: updatedAd.status,
        year: updatedAd.year,
        body_type: updatedAd.bodyType,
      },
    });
    } catch(error){
      return res.status(error.statusCode || 500).json(error.message);
    } 
  }

  static updateCarPrice(req, res) {
    try{
      const id = parseInt(req.params.id, 10);
      const updatedAd = Cars.updateCarAdPrice(id, req.body.price);

      return res.status(200).json({
        status: 200,
        data: {
          id: updatedAd.id,
          email: updatedAd.email,
          created_on: updatedAd.createdOn,
          manufacturer: updatedAd.manufacturer,
          model: updatedAd.model,
          price: updatedAd.price,
          state: updatedAd.state,
          status: updatedAd.status,
          year: updatedAd.year,
          body_type: updatedAd.bodyType,
        },
      });
    } catch (error) {
        res.status(error.statusCode || 500).json(error.message);
      }
  }

  static find(req, res) {
    try{
      const { query } = req;

      if (query.status && query.min_price && query.max_price) {
        // eslint-disable-next-line max-len
        const filtered = Cars.allCarsAds.filter(x => x.status === query.status && x.price > query.min_price && x.price < query.max_price);

        if (filtered.length === 0) {
          return res.status(200).json({
            status: 200,
            data: 'No record found',
          });
        }

        return res.status(200).json({
          status: 200,
          data: filtered,
        });
      }

      if (query.status && query.manufacturer) {
        // eslint-disable-next-line max-len
        const filtered = Cars.allCarsAds.filter(x => x.status === query.status && x.manufacturer === query.manufacturer);

        if (filtered.length === 0) {
          return res.status(200).json({
            status: 200,
            data: 'No record found',
          });
        }

        return res.status(200).json({
          status: 200,
          data: filtered,
        });
      }

      if (query.status && query.bodyType) {
        // eslint-disable-next-line max-len
        const filtered = Cars.allCarsAds.filter(x => x.status === query.status && x.bodyType === query.bodyType);

        if (filtered.length === 0) {
          return res.status(200).json({
            status: 200,
            data: 'No record found',
          });
        }

        return res.status(200).json({
          status: 200,
          data: filtered,
        });
      }

      if (query.status && query.state) {
        // eslint-disable-next-line max-len
        const filtered = Cars.allCarsAds.filter(x => x.status === query.status && x.state === query.state);

        if (filtered.length === 0) {
          return res.status(200).json({
            status: 200,
            data: 'No record found',
          });
        }

        return res.status(200).json({
          status: 200,
          data: filtered,
        });
      }

      if (query.status) {
        const filtered = Cars.allCarsAds.filter(carAd => carAd.status === req.query.status);


        if (filtered.length === 0) {
          return res.status(200).json({
            status: 200,
            data: 'No record found',
          });
        }

        return res.status(200).json({
          status: 200,
          data: filtered,
        });
      }

      const allAds = Cars.allCarsAds;
      return res.status(200).json({
        status: 200,
        data: allAds,
      });
    } catch (error) {
        res.status(error.statusCode || 500).json(error.message);
      }
  }

  static findSpecificCar(req, res) {
    try{
      const id = parseInt(req.params.id, 10);
      const carAd = Cars.allCarsAds.find(car => car.id === id);
      if (carAd === undefined) {
        return res.status(200).json({
          status: 200,
          data: 'No record found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: {
          id: carAd.id,
          owner: carAd.owner,
          email: carAd.email,
          created_on: carAd.createdOn,
          manufacturer: carAd.manufacturer,
          model: carAd.model,
          price: carAd.price,
          state: carAd.state,
          status: carAd.status,
          year: carAd.year,
          body_type: carAd.bodyType,
          images: carAd.imgUrl,
        },
      });
    } catch (error) {
        res.status(error.statusCode || 500).json(error.message);
      }
  }

  static deleteAd(req, res) {
    try{
      const { users } = req.authData;
      if (users.isAdmin === true) {
        const id = parseInt(req.params.id, 10);
        const adIndex = Cars.allCarsAds.findIndex(x => x.id === id);

        if (adIndex === parseInt('-1', 10)) {
          return res.status(200).json({
            status: 200,
            data: 'No record found',
          });
        }

        Cars.allCarsAds.splice(adIndex, 0);

        return res.status(200).json({
          status: 200,
          data: 'Car Ad successfully deleted',
        });
      }

      return res.status(403).json({
        status: 403,
        error: 'Forbidden: Only Admin can delete an AD',
      });
    }
  catch (error) {
        res.status(error.statusCode || 500).json(error.message);
      }
    }
}


export default CarAds;