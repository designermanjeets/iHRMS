const { Designation, Audit } = require('../../models/index');

const mutation = {
  createDesignation:(_, {
    designation,
    department,
    created_at,
    created_by
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const leave = await Designation.findOne({$or:[ {designation} ]})
    if (leave) {
      reject('Designation already exist');
    } else {
      const newDesignation = await Designation.create({
        designation,
        department,
        created_at
      })
      const nmodified = {
        newDesig_ID: newDesignation._id,
        action: 'Designation Created',
        created_by: created_by,
        created_at: created_at,
        createdDesignation: newDesignation
      }
      Audit.find({}).then(val =>{
        if(val.length) {
          Audit.findOneAndUpdate(
            { },
            { $push: { desigAudit: nmodified  }  }, { new: true })
            .then((result) => {
              resolve(result);
            });
        } else {
          Audit.create({ desigAudit: nmodified  })
            .then((result) => {
              resolve(result);
            });
        }
        resolve(result);
      });
      resolve(newDesignation);
    }
  }),

  updateDesignation:(_, {
    id,
    designation,
    department,
    modified
  },{me,secret}) => new Promise(async (resolve, reject) => {
    const dtype = await Designation.findById(id);
    try{
      let param = { designation, department }
      let changeFields = {};
      for ( item in param) {
        if(param[item] && param[item] !== dtype[item]) {
          changeFields[item] = param[item];
        }
      }
      const ltype = await Designation.findById(id);
      if (!ltype) throw new Error('Designation not found!!')
      if(ltype) {
        await Designation.findByIdAndUpdate(id,{$set:{...param}, $push: { 'modified': modified  }  },{new: true})
          .then((result) => {
            if(result && Object.keys(changeFields).length !== 0) {
              const nmodified = {
                design_ID: dtype._id,
                modified_by: modified[0].modified_by,
                modified_at: modified[0].modified_at,
                action: 'Changed',
                changedObj: changeFields,
                oldDesignData: dtype
              }
              Audit.find({}).then(val =>{
                if(val.length) {
                  Audit.findOneAndUpdate(
                    { },
                    { $push: { desigAudit: nmodified  }  }, { new: true })
                    .then((result) => {
                      resolve(result);
                    });
                } else {
                  Audit.create({ desigAudit: nmodified  })
                    .then((result) => {
                      resolve(result);
                    });
                }
                resolve(result);
              });
            } else {
              resolve(result);
            }
          })
      }
    } catch(error){
      reject(error);
    }
  }),

  deleteDesignation:(_, { id, modified },{me,secret}) => new Promise(async (resolve, reject) => {
    try{
      const ltype = await Designation.findById(id);
      if (!ltype) throw new Error('Designation not found!!')
      if(ltype) {
        await Designation.findByIdAndDelete(id)
          .then((result) => {
            const nmodified = {
              design_ID: ltype._id,
              modified_by: modified[0].modified_by,
              modified_at: modified[0].modified_at,
              action: 'Designation Deleted!',
              deletedDesignation: ltype
            }
            Audit.find({}).then(val =>{
              if(val.length) {
                Audit.findOneAndUpdate(
                  { },
                  { $push: { desigAudit: nmodified  }  }, { new: true })
                  .then((result) => {
                    resolve(result);
                  });
              } else {
                Audit.create({ desigAudit: nmodified  })
                  .then((result) => {
                    resolve(result);
                  });
              }
            });
            resolve(result);
          })
      }
    } catch(error){
      reject(error);
    }
  })
}

module.exports = { mutation };