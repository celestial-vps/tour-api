using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Mappings;
using Microsoft.EntityFrameworkCore.Storage;
using WeddingOrganizerAPI.Common;
using WeddingOrganizerAPI.DTOs;
using WeddingOrganizerAPI.Mappings;
using WeddingOrganizerAPI.Models;
using WeddingOrganizerAPI.Repositories;
using WeddingOrganizerAPI.Services.Interfaces;

namespace WeddingOrganizerAPI.Services
{
    public class SouvenirService : ISouvenirService
    {
        private readonly ISouvenirRepository _souvenirRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public SouvenirService(
            ISouvenirRepository souvenirRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _souvenirRepository = souvenirRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? souvenir, ApiError? err)> CreateAsync(CreateSouvenirDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new Souvenir
                {
                    Name = dto.Name,
                    Location = dto.Location,
                    Capacity = dto.Capacity,
                    Price = dto.Price,
                    Contact = dto.Contact,
                    CreatedBy = userOid,
                    CreatedAt = now,
                    LastModifiedBy = userOid,
                    UpdatedAt = now,
                };

                var (result, err) = await _souvenirRepository.SaveAsync(entity);
                if (err != null || result == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(err));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                // var response = _mapper.Map<MessageVM>(result);
                var response = new MessageVM
                {
                    Value = result.Oid.ToString(),
                    Name = result.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? souvenir, ApiError? err)> UpdateAsync(Guid oid, UpdateSouvenirDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingSouvenir, findErr) = await _souvenirRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingSouvenir == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Souvenir not found"));
                }

                // Update only if DTO fields are not null
                existingSouvenir.Name = dto.Name ?? existingSouvenir.Name;
                existingSouvenir.Location = dto.Location ?? existingSouvenir.Location;
                // existingSouvenir.Capacity = dto.Capacity ?? existingSouvenir.Capacity;
                // existingSouvenir.Price = dto.Price ?? existingSouvenir.Price;
                existingSouvenir.Contact = dto.Contact ?? existingSouvenir.Contact;
                existingSouvenir.LastModifiedBy = userOid;
                existingSouvenir.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _souvenirRepository.UpdateAsync(oid, existingSouvenir);
                if (updateErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(updateErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = updatedResult.Oid.ToString(),
                    Name = updatedResult.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(MessageVM? souvenir, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (souvenir, findErr) = await _souvenirRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (souvenir == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Souvenir not found"));
                }

                var (deleted, removeErr) = await _souvenirRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = souvenir.Oid.ToString(),
                    Name = souvenir.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<SouvenirVM> souvenirs, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _souvenirRepository.FindAllAsync();
                if (err != null)
                    return (new List<SouvenirVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<SouvenirVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<SouvenirVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(SouvenirVM? souvenir, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _souvenirRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("Souvenir not found"));

                var response = _mapper.Map<SouvenirVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<SouvenirVM> souvenirs, ApiError? err)> FindPageAsync(SouvenirFilterDto dto, int page, int pageSize)
        {
            try
            {
                var (result, total, err) = await _souvenirRepository.FindByCriteriaPageAsync( page, pageSize,dto);
                if (err != null)
                    return (new List<SouvenirVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<SouvenirVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<SouvenirVM>(), ApiError.InternalServerError(ex));
            }
        }
 

    }
}
