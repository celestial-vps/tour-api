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
    public class ShoesService : IShoesService
    {
        private readonly IShoesRepository _shoesRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public ShoesService(
            IShoesRepository shoesRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _shoesRepository = shoesRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? shoes, ApiError? err)> CreateAsync(CreateShoesDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new Shoes
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

                var (result, err) = await _shoesRepository.SaveAsync(entity);
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

        public async Task<(MessageVM? shoes, ApiError? err)> UpdateAsync(Guid oid, UpdateShoesDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingShoes, findErr) = await _shoesRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingShoes == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Shoes not found"));
                }

                // Update only if DTO fields are not null
                existingShoes.Name = dto.Name ?? existingShoes.Name;
                existingShoes.Location = dto.Location ?? existingShoes.Location;
                // existingShoes.Capacity = dto.Capacity ?? existingShoes.Capacity;
                // existingShoes.Price = dto.Price ?? existingShoes.Price;
                existingShoes.Contact = dto.Contact ?? existingShoes.Contact;
                existingShoes.LastModifiedBy = userOid;
                existingShoes.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _shoesRepository.UpdateAsync(oid, existingShoes);
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

        public async Task<(MessageVM? shoes, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (shoes, findErr) = await _shoesRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (shoes == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("Shoes not found"));
                }

                var (deleted, removeErr) = await _shoesRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = shoes.Oid.ToString(),
                    Name = shoes.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<ShoesVM> shoess, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _shoesRepository.FindAllAsync();
                if (err != null)
                    return (new List<ShoesVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<ShoesVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<ShoesVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(ShoesVM? shoes, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _shoesRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("Shoes not found"));

                var response = _mapper.Map<ShoesVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<ShoesVM> shoess, ApiError? err)> FindPageAsync(ShoesFilterDto dto, int page, int pageSize)
        {
            try
            {
                var (result, total, err) = await _shoesRepository.FindByCriteriaPageAsync( page, pageSize,dto);
                if (err != null)
                    return (new List<ShoesVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<ShoesVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<ShoesVM>(), ApiError.InternalServerError(ex));
            }
        }
 

    }
}
