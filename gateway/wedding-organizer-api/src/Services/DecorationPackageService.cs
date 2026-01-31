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
    public class DecorationPackageService : IDecorationPackageService
    {
        private readonly IDecorationPackageRepository _decorationPackageRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public DecorationPackageService(
            IDecorationPackageRepository decorationPackageRepository,
            IMapper mapper,
            IUnitOfWork unitOfWork)
        {
            _decorationPackageRepository = decorationPackageRepository;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        public async Task<(MessageVM? decorationPackage, ApiError? err)> CreateAsync(CreateDecorationPackageDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var now = DateTime.UtcNow;
                var entity = new DecorationPackage
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

                var (result, err) = await _decorationPackageRepository.SaveAsync(entity);
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

        public async Task<(MessageVM? decorationPackage, ApiError? err)> UpdateAsync(Guid oid, UpdateDecorationPackageDto dto, Guid userOid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (existingDecorationPackage, findErr) = await _decorationPackageRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (existingDecorationPackage == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("DecorationPackage not found"));
                }

                // Update only if DTO fields are not null
                existingDecorationPackage.Name = dto.Name ?? existingDecorationPackage.Name;
                existingDecorationPackage.Location = dto.Location ?? existingDecorationPackage.Location;
                // existingDecorationPackage.Capacity = dto.Capacity ?? existingDecorationPackage.Capacity;
                // existingDecorationPackage.Price = dto.Price ?? existingDecorationPackage.Price;
                existingDecorationPackage.Contact = dto.Contact ?? existingDecorationPackage.Contact;
                existingDecorationPackage.LastModifiedBy = userOid;
                existingDecorationPackage.UpdatedAt = DateTime.UtcNow;

                var (updatedResult, updateErr) = await _decorationPackageRepository.UpdateAsync(oid, existingDecorationPackage);
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

        public async Task<(MessageVM? decorationPackage, ApiError? err)> DeleteAsync(Guid oid)
        {
            IDbContextTransaction? transaction = null;
            try
            {
                transaction = await _unitOfWork.BeginTransactionAsync();

                var (decorationPackage, findErr) = await _decorationPackageRepository.FindByIdAsync(oid);
                if (findErr != null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(findErr));
                }

                if (decorationPackage == null)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.NotFound("DecorationPackage not found"));
                }

                var (deleted, removeErr) = await _decorationPackageRepository.RemoveAsync(oid);
                if (removeErr != null || !deleted)
                {
                    await transaction.RollbackAsync();
                    return (null, ApiError.InternalServerError(removeErr));
                }

                await _unitOfWork.SaveChangesAsync();
                await transaction.CommitAsync();

                var response = new MessageVM
                {
                    Value = decorationPackage.Oid.ToString(),
                    Name = decorationPackage.Name
                };
                return (response, null);
            }
            catch (Exception ex)
            {
                if (transaction != null) await transaction.RollbackAsync();
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<DecorationPackageVM> decorationPackages, ApiError? err)> FindAllAsync()
        {
            try
            {
                var (result, err) = await _decorationPackageRepository.FindAllAsync();
                if (err != null)
                    return (new List<DecorationPackageVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<DecorationPackageVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<DecorationPackageVM>(), ApiError.InternalServerError(ex));
            }
        }

        public async Task<(DecorationPackageVM? decorationPackage, ApiError? err)> FindByIdAsync(Guid oid)
        {
            try
            {
                var (result, err) = await _decorationPackageRepository.FindByIdAsync(oid);
                if (err != null)
                    return (null, ApiError.InternalServerError(err));

                if (result == null)
                    return (null, ApiError.NotFound("DecorationPackage not found"));

                var response = _mapper.Map<DecorationPackageVM>(result);
                return (response, null);
            }
            catch (Exception ex)
            {
                return (null, ApiError.InternalServerError(ex));
            }
        }

        public async Task<(List<DecorationPackageVM> decorationPackages, ApiError? err)> FindPageAsync(DecorationPackageFilterDto dto, int page, int pageSize)
        {
            try
            {
                var (result, total, err) = await _decorationPackageRepository.FindByCriteriaPageAsync( page, pageSize,dto);
                if (err != null)
                    return (new List<DecorationPackageVM>(), ApiError.InternalServerError(err));

                var responses = _mapper.Map<List<DecorationPackageVM>>(result);
                return (responses, null);
            }
            catch (Exception ex)
            {
                return (new List<DecorationPackageVM>(), ApiError.InternalServerError(ex));
            }
        }
 

    }
}
